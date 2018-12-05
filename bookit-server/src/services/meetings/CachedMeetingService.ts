import * as moment from 'moment';
import {Duration, Moment} from 'moment';
import {v4 as uuid} from 'uuid';

import {Meeting} from '../../model/Meeting';
import {MeetingsService} from './MeetingService';
import {Participant} from '../../model/Participant';
import {RootLog as logger} from '../../utils/RootLogger';
import {RoomService} from '../rooms/RoomService';
import {Room} from '../../model/Room';
import {Domain} from '../../model/EnvironmentConfig';
import {SubCache} from './SubCache';
import {matchMeeting, obscureMeetingDetails} from '../../rest/meetings/meeting_functions';
import {retryUntilAtInterval} from '../../utils/retry';
import {IdCachingStrategy} from './IdCachingStrategy';
import {IdentityCache} from '../../utils/cache/caches';
import {Attendee} from '../../model/Attendee';


const DEFAULT_REFRESH_IN_MILLIS = 300 * 1000;
// const DEFAULT_REFRESH_IN_MILLIS = 1 * 1000;


export class CachedMeetingService implements MeetingsService {

  private jobId: NodeJS.Timer;

  private roomSubCaches: Map<string, SubCache<Room>>;

  private ownerSubCaches: Map<string, SubCache<Participant>>;

  constructor(private _domain: Domain,
              private roomService: RoomService,
              private delegatedMeetingsService?: MeetingsService) {

    const _internalRefresh = () => {
      /*
      Do a refresh of the caches based on their bounds or a computed default window.  I would like to eventually
      tie the user cache refreshes against user participants from the rooms.
       */
      this.refreshRoomCaches()
          .then(() => this.refreshUserCaches())
          .then(() => logger.info('Caches refreshed'));
    };

    if (!delegatedMeetingsService) {
      this.delegatedMeetingsService = new MockGraphMeetingService(_domain.domainName);
    }

    logger.info('Constructing CachedMeetingService');
    _internalRefresh();
    this.jobId = setInterval(_internalRefresh, DEFAULT_REFRESH_IN_MILLIS);

    this.roomSubCaches = new Map<string, SubCache<Room>>();
    this.ownerSubCaches = new Map<string, SubCache<Participant>>();
  }


  domain() {
    return this.delegatedMeetingsService.domain();
  }


  clearCaches() {
    logger.debug('Clearing caches');
    this.roomSubCaches = new Map<string, SubCache<Room>>();
    this.ownerSubCaches = new Map<string, SubCache<Participant>>();

    this.delegatedMeetingsService.clearCaches();
    return true;
  }


  getUserMeeting(user: Participant, id: string): Promise<Meeting> {
    const userCache = this.getCacheForOwner(user);
    const userMeeting = userCache.get(id);
    return userMeeting ? Promise.resolve(userMeeting) : Promise.reject(`Unable to find meeting ${id}`);
  }


  getUserMeetings(user: Participant, start: Moment, end: Moment): Promise<Meeting[]> {
    const userCache = this.getCacheForOwner(user);
    const fetch = userCache.isCacheWithinBound(start, end) ? Promise.resolve() : this.refreshUserCache(user, start, end);
    return fetch.then(() => userCache.getMeetings(start, end));
  }


  /**
   * This gets the meetings for a particular date bound against a particular room resource.
   *
   * We will consult if the date bound is contained within the room's cache.  If not, we will refresh with
   * a larger window and allow the fetch from cache to proceed.
   *
   * NB: This can be further optimized but we'll leave it as is for now.
   * @param room
   * @param start
   * @param end
   * @returns {Promise<TResult2|Meeting[]>}
   */
  getMeetings(room: Room, start: Moment, end: Moment): Promise<Meeting[]> {
    // console.trace('CachedMeetingService::getMeetings()', room, start, end);
    const roomCache = this.getRoomCacheForRoom(room);
    const fetch = roomCache.isCacheWithinBound(start, end) ? Promise.resolve() : this.refreshRoomCache(room, start, end);
    return fetch.then(() => roomCache.getMeetings(start, end));
  }


  createUserMeeting(subj: string, start: Moment, duration: Duration, owner: Participant, room: Room): Promise<Meeting> {
    return this.delegatedMeetingsService
               .createUserMeeting(subj, start, duration, owner, room)
               .then(userMeeting => {
                 const roomMeeting = this.cacheRoomMeeting(room, userMeeting);
                 this.matchAndReplaceRoomMeeting(roomMeeting, room);

                 return this.cacheUserMeeting(owner, userMeeting);
               })
               .catch(error => {
                 logger.error(error);
                 throw new Error(error);
               });
  }


  updateUserMeeting(id: string, subj: string, start: Moment, duration: Duration, owner: Participant, room: Room): Promise<Meeting> {
    logger.info('CachedMeetingService::updateUserMeeting() - updating meeting', owner.email, id);
    const originalMeeting: Meeting = Array.from(this.ownerSubCaches.values())
                                          .reduce((meeting, cache) => meeting || cache.get(id), undefined);

    if (!originalMeeting) {
      logger.error('Could not find meeting', owner.email, id);
      return Promise.reject(`Unable to find meeting id: ${id}`);
    }

    return this.delegatedMeetingsService
               .updateUserMeeting(id, subj, start, duration, originalMeeting.owner, room)
               .then(updatedMeeting => {
                 logger.debug('Updated meeting', updatedMeeting);

                 const roomMeeting = this.cacheRoomMeeting(room, updatedMeeting);
                 this.matchAndReplaceRoomMeeting(roomMeeting, room);

                 /*
                  MS may provide a different meeting id for each version of a meeting so we need to evict the old id but
                  only if the id has changed.
                   */
                 if (updatedMeeting.id !== id) {
                   this.evictMeetingFromUserCache(originalMeeting.owner, id);
                 }

                 return this.cacheUserMeeting(originalMeeting.owner, updatedMeeting);
               })
               .catch(error => {
                 logger.error(error);
                 throw new Error(error);
               });
  }


  findMeeting(room: Room, meetingId: string, start: Moment, end: Moment): Promise<Meeting> {
    return new Promise((resolve, reject) => {
      const roomCache = this.getRoomCacheForRoom(room);
      const meeting = roomCache.get(meetingId);
      meeting ? resolve(meeting) : reject('Unable to find meeting ' + meetingId);
    });
  }


  /**
   * The rest interface for delete expects a room e-mail and a meeting id.  The assumptions for all this stuff
   * has changed a bit and we wanted to maintain the interface while changing the underlying behavior.
   * @param owner
   * @param id
   * @returns {Promise<T>}
   */
  deleteUserMeeting(owner: Participant, id: string): Promise<Meeting> {
    const userMeeting: Meeting = Array.from(this.ownerSubCaches.values())
                                      .reduce((meeting, cache) => meeting || cache.get(id), undefined);

    if (!userMeeting) {
      logger.error('Could not find meeting', owner.email, id);
      return Promise.reject(`Unable to find meeting id: ${id}`);
    }

    logger.info('Will delete meeting from owner', userMeeting.owner, id);
    return this.delegatedMeetingsService
               .deleteUserMeeting(userMeeting.owner, userMeeting.id)
               .then(() => {
                 const userMeeting = this.evictUserMeeting(id);
                 return this.evictRoomMeetingForUserMeeting(userMeeting);
               })
               .then(meeting => {
                 return meeting;
               });
  }


  private evictRoomMeetingForUserMeeting(userMeeting: Meeting): Promise<Meeting> {
    const roomCache = this.getRoomCacheForMeeting(userMeeting);
    const [searchStart, searchEnd] = this.getSearchDateRange(userMeeting);

    logger.info('evictRoomMeetingForUserMeeting() - evicting room meeting for user meeting',
                userMeeting,
                searchStart,
                searchEnd);
    return roomCache.getMeetings(searchStart, searchEnd)
                    .then(roomMeetings => {
                      if (roomMeetings) {
                        logger.info('evictRoomMeetingForUserMeeting() - got room meetings', roomMeetings.length);
                        return matchMeeting(userMeeting, roomMeetings);
                      }

                      return null;
                    })
                    .then(roomMeeting => {
                      if (roomMeeting) {
                        const evictedMeeting = this.evictRoomMeeting(roomMeeting.id);
                        logger.info(`evictRoomMeetingForUserMeeting() - evicted room meeting ${evictedMeeting.id}`);
                      }

                      return null;
                    });
  }

  doSomeShiznit(test: any): Promise<any> {
    return this.delegatedMeetingsService.doSomeShiznit(test);
  }


  private matchAndReplaceRoomMeeting(meeting: Meeting, room: Room) {
    setTimeout(() => {
      const opBegin = new Date();
      return this.waitForRoomMeeting(meeting, room)
                 .then(meetings => {
                   if (meetings.length > 0) {
                     logger.warn(`Matched multiple meetings for meeting id ${meeting.id}`);
                   }

                   /*
                    The meeting we passed in was a "user" version that needs to be evicted because it was an
                    optimistic insertion into the cache
                     */
                   this.evictRoomMeeting(meeting.id);

                   const foundMeeting = meetings[0];
                   const opEnd = new Date();
                   this.cacheRoomMeeting(room, foundMeeting);
                   logger.debug('matchAndReplaceRoomMeeting() - matched and replaced', (Math.abs(opEnd.getMilliseconds() - opBegin.getMilliseconds())),  meetings);
                 });

    }, 1000);
  }


  private waitForRoomMeeting(toMatch: Meeting, room: Room): Promise<Meeting[]> {
    const [searchStart, searchEnd] = this.getSearchDateRange(toMatch);
    const fetchMeetings = this.getMeetings.bind(this, room, searchStart, searchEnd);

    const matchedUserMeeting = matchMeeting.bind(this, toMatch);
    return retryUntilAtInterval(50, fetchMeetings, matchedUserMeeting);
  }


  private getRoomCacheForRoom(room: Room): SubCache<Room> {
    if (!this.roomSubCaches.has(room.email)) {
      const roomCache = new SubCache<Room>(room);
      this.roomSubCaches.set(room.email, roomCache);
    }

    return this.roomSubCaches.get(room.email);
  }


  private getRoomCacheForMeeting(meeting: Meeting): SubCache<Room> {
    return meeting.participants.reduce((cache, participant) => {
      return cache || this.roomSubCaches.get(participant.email);
    }, undefined);
  }


  private getCacheForOwner(owner: Participant): SubCache<Participant> {
    if (!this.ownerSubCaches.has(owner.email)) {
      const roomCache = new SubCache<Participant>(owner);
      this.ownerSubCaches.set(owner.email, roomCache);
    }

    return this.ownerSubCaches.get(owner.email);
  }


  private refreshRoomCaches(): Promise<void> {
    const [defaultStart, defaultEnd] = this.getDefaultDateRange();

    return this.roomService.getRoomList('nyc')
               .then(roomList => {
                 const meetingPromises = roomList.rooms.map(room => this.refreshRoomCache(room, defaultStart, defaultEnd));
                 return Promise.all(meetingPromises);
               })
               .then(() => undefined);
  }


  private refreshUserCaches(): Promise<void> {
    const [defaultStart, defaultEnd] = this.getDefaultDateRange();

    const ownerEntries = Array.from(this.ownerSubCaches.entries());
    const refreshes = ownerEntries.map(kvPair => {
      const [, cache] = kvPair;
      const owner = cache.getAttendee();
      return this.refreshUserCache(owner, defaultStart, defaultEnd);
    });

    return Promise.all(refreshes).then(() => undefined);
  }


  /*
  the next two functions could be refactored for reusability
   */
  private refreshRoomCache(room: Room, start: Moment, end: Moment): Promise<void> {
    const roomCache = this.getRoomCacheForRoom(room);

    const fetchMeetings = (): Promise<Meeting[]> => {
      const fetchStart = roomCache.getFetchStart(start);
      const fetchEnd = roomCache.getFetchEnd(end);

      return this.delegatedMeetingsService.getMeetings(room, fetchStart, fetchEnd);
    };

    return fetchMeetings().then(roomMeetings => {
      logger.info(`CachedMeetingService::refreshCache() - refreshed ${room.email}`, roomMeetings.length);
      roomCache.cacheMeetings(roomMeetings);
    });
  }


  private refreshUserCache(owner: Participant, start: Moment, end: Moment): Promise<void> {
    const userCache = this.getCacheForOwner(owner);

    const fetchMeetings = (): Promise<Meeting[]> => {
      const fetchStart = userCache.getFetchStart(start);
      const fetchEnd = userCache.getFetchEnd(end);

      return this.delegatedMeetingsService.getUserMeetings(owner, fetchStart, fetchEnd);
    };

    const filterMeetings = (meetings: Meeting[]): Meeting[] => {
      return meetings.filter(meeting => {
        return meeting.location.displayName.length;
      });
    };

    return fetchMeetings().then(userMeetings => {
      logger.debug(`CachedMeetingService::refreshCache() - refreshed ${owner.email}`);
      const validMeetings = filterMeetings(userMeetings);
      userCache.cacheMeetings(validMeetings);
    });
  }


  private cacheRoomMeeting(room: Room, meeting: Meeting) {
    const obscured = obscureMeetingDetails(meeting);
    return this.getRoomCacheForRoom(room).put(obscured);
  }


  private cacheUserMeeting(owner: Participant, meeting: Meeting) {
    return this.getCacheForOwner(owner).put(meeting);
  }


  private evictMeeting(id: string): Meeting|null {
    this.evictRoomMeeting(id);
    return this.evictUserMeeting(id);
  }


  private evictUserMeeting(id: string): Meeting|undefined {
    return this.evictMeetingFromCache(this.ownerSubCaches, id);
  }


  private evictRoomMeeting(id: string) {
    return this.evictMeetingFromCache(this.roomSubCaches, id);
  }


  private evictMeetingFromUserCache(user: Participant, id: string): Meeting|null {
    const subCache = this.ownerSubCaches.get(user.email);
    return subCache.remove(id);
  }


  private evictMeetingFromCache(caches: Map<string, SubCache<Attendee>>, id: string): Meeting|null {
    const cacheList = Array.from(caches.values());
    return cacheList.reduce((meeting, cache) => meeting || cache.remove(id), null);
  }

  /*

   */
  private getSearchDateRange(meeting: Meeting): Moment[] {
    const searchStart = meeting.start.clone().subtract('1', 'second');
    const searchEnd = meeting.end.clone().add('1', 'second');

    return [searchStart, searchEnd];
  }

  private getDefaultDateRange(): Moment[] {
    const defaultStart = moment().startOf('day');
    const defaultEnd = moment().endOf('day');

    return [defaultStart, defaultEnd];
  }
}


/**
 * This class is a mock service but also attempts to imitate Microsoft's API behavior
 */
class MockGraphMeetingService implements MeetingsService {

  private userMeetingCache = new IdentityCache<Meeting>(new Map<string, Meeting>(), new IdCachingStrategy());
  private roomMeetingCache = new IdentityCache<Meeting>(new Map<string, Meeting>(), new IdCachingStrategy());


  constructor(private _domain: string) {
    this.clearCaches(true);
  }


  domain() {
    return this._domain;
  }


  clearCaches(initializing = false) {
    const type = initializing ? ' Initializing' : 'Clearing';
    logger.debug(`${type} Mock Graph caches`);
    this.roomMeetingCache.clear();
    this.userMeetingCache.clear();

    return true;
  }


  getMeetings(room: Room, start: moment.Moment, end: moment.Moment): Promise<Meeting[]> {
    // logger.info('PassThroughMeetingService::getMeetings(${room.email})', this.roomMeetings());
    const roomMeetings = this.roomMeetings().filter(meeting => meeting.location.displayName === room.name);
    const mappedMeetings = roomMeetings.map(obscureMeetingDetails);

    if (mappedMeetings.length > 0) {
      logger.debug(`PassThroughMeetingService::getMeetings(${room.email}) - resolving`, mappedMeetings.map(m => m.id));
    }

    return Promise.resolve(roomMeetings);
  }


  getUserMeeting(user: Participant, id: string): Promise<Meeting> {
    const filtered = this.userMeetings()
                         .filter(meeting => meeting.owner.email === user.email)
                         .filter(meeting => meeting.id === id);
    return filtered.length ? Promise.resolve(filtered[0]) : Promise.reject(`Unable to find meeting ${id}`);
  }


  getUserMeetings(user: Participant, start: Moment, end: Moment): Promise<Meeting[]> {
    const filtered = this.userMeetings().filter(meeting => meeting.owner.email === user.email);
    // logger.info('Filtered user meetings', filtered);
    return Promise.resolve(filtered);
  }


  createUserMeeting(subj: string, start: Moment, duration: Duration, owner: Participant, room: Room): Promise<Meeting> {
    return new Promise((resolve) => {
      const userMeetingId = 'user_' + uuid();
      const roomMeetingId = 'room_' + uuid();

      const startUTC = moment.utc(start);
      const endUTC = moment.utc(start.clone().add(duration));

      const userMeeting: Meeting = {
        id: userMeetingId,
        userMeetingId: roomMeetingId,
        owner: owner,
        title: subj, // simulates microsoft's behavior
        start: startUTC,
        location: {displayName: room.name},
        end: endUTC,
        participants: [owner, room],
      };

      logger.debug('MockGraphMeetingService::createUserMeeting()', userMeeting);
      this.userMeetingCache.put(userMeeting);

      const addRoomMeeting = () => {
        const roomMeeting: Meeting = {
          id: roomMeetingId,
          userMeetingId: userMeeting.id,
          owner: owner,
          title: owner.name, // simulates microsoft's behavior
          start: startUTC,
          location: {displayName: room.name},
          end: endUTC,
          participants: [owner, room],
        };

        this.roomMeetingCache.put(roomMeeting);
      };

      /*
       when creating a user meeting with the graph, it updates that perspective immediately with the new information
       but we need to simulate the delay from the room perspective.
        */
      MockGraphMeetingService.withDelay(addRoomMeeting);

      resolve(userMeeting);
    });
  }


  updateUserMeeting(userMeetingId: string, subj: string, start: Moment, duration: Duration, owner: Participant, room: Room): Promise<Meeting> {
    function update(meeting: Meeting, start: Moment, duration: Duration, subj?: string) {
      if (!meeting) {
        return null;
      }

      meeting.start = moment.utc(start);
      meeting.end = meeting.start.clone().add(duration);

      if (subj) {
        meeting.title = subj;
      }

      return meeting;
    }

    return new Promise((resolve) => {
      logger.debug('MockGraphMeetingService::updateUserMeeting() - updating', userMeetingId);
      const userMeeting = this.userMeetingCache.get(userMeetingId);
      update(userMeeting, start, duration, subj);

      const updateRoomMeeting = () => {
        const roomMeeting = this.roomMeetingCache.get(userMeeting.userMeetingId);
        update(roomMeeting, start, duration);
      };

      MockGraphMeetingService.withDelay(updateRoomMeeting);

      resolve(userMeeting);
    });
  }


  deleteUserMeeting(owner: Participant, id: string): Promise<any> {
    const userMeeting = this.userMeetingCache.get(id);
    this.userMeetingCache.remove(userMeeting);

    return Promise.resolve();
  }


  findMeeting(room: Room, id: string, start: moment.Moment, end: moment.Moment): Promise<Meeting> {
    const roomMeeting = this.roomMeetingCache.get(id);
    if (roomMeeting) {
      return Promise.resolve(roomMeeting);
    }

    return Promise.reject('Meeting not found');
  }


  doSomeShiznit(test: any): Promise<any> {
    return Promise.reject('No actual underlying meetings');
  }


  private userMeetings(): Meeting[] {
    return Array.from(this.userMeetingCache.values());
  }


  private roomMeetings(): Meeting[] {
    return Array.from(this.roomMeetingCache.values());
  }


  private static withDelay(f: (args: any[]) => void) {
    const padding = 25 + (Math.random() * 75);
    const additional = Math.random() * 400;

    const delay = padding + additional;
    setTimeout(f, delay);
  }
}
