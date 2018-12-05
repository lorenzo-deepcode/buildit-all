import * as moment from 'moment';
import {Moment} from 'moment';

import {Meeting} from '../../model/Meeting';
import {RootLog as logger} from '../../utils/RootLogger';
import {isMeetingWithinRange} from '../../utils/validation';
import {IdCachingStrategy} from './IdCachingStrategy';
import {ParticipantsCachingStrategy} from './ParticipantsCachingStrategy';
import {RoomCachingStrategy} from './RoomCachingStrategy';
import {StartDateCachingStrategy} from './StartDateCachingStrategy';
import {EndDateCachingStrategy} from './EndDateCachingStrategy';
import {IdentityCache, ListCache} from '../../utils/cache/caches';
import {Attendee} from '../../model/Attendee';


/**
 * This is a dedicated cache against the an attendee of the meeting.
 *
 *
 * NB: Since the access pattern against the Graph API is on an attendee basis, the previous caching scheme
 * on a per service basis was faulty.
 */
export class SubCache<T extends Attendee> {

  /*
  * Needed to store evicted ids due to race conditions in cache coherency with what we've deleted
  * and what Microsoft hasn't deleted yet.
  * */
  private evictedIds = new Set<string>();
  private idCache = new IdentityCache<Meeting>(new Map<string, Meeting>(), new IdCachingStrategy());
  private participantCache = new ListCache<Meeting>(new Map<string, Map<string, Meeting>>(),
                                                    new ParticipantsCachingStrategy());
  private roomCache = new ListCache<Meeting>(new Map<string, Map<string, Meeting>>(), new RoomCachingStrategy());
  private startDateCache = new ListCache<Meeting>(new Map<string, Map<string, Meeting>>(), new StartDateCachingStrategy());
  private endDateCache = new ListCache<Meeting>(new Map<string, Map<string, Meeting>>(), new EndDateCachingStrategy());

  private cacheStart: moment.Moment;
  private cacheEnd: moment.Moment;

  constructor(private attendee: T) {
    /*
    Initially, caches will be empty.  Don't set arbitrary bounds here.  Eventually, date boundary checks should
    go against the date caches (or not, maybe the caches will be removed).
     */
    this.cacheStart = undefined;
    this.cacheEnd = undefined;

    logger.info(`Constructing SubCache (${this.attendee.email})`);
  }


  getAttendee(): T {
    return this.attendee;
  }


  /**
   * Determines what the fetch start for the service calls should be.  This consults the cache whether the passed
   * in start date is contained within the cache.
   *
   * @param start the date to check against the cache
   * @returns {Moment}
   */
  getFetchStart(start: Moment): Moment {
    if (!this.cacheStart) {
      return start;
    }

    return start.isBefore(this.cacheStart) ? start : this.cacheStart;
  }


  /**
   * Determines what the fetch end for the service calls should be.  This consults the cache whether the passed
   * in end date is contained within the cache.
   * @param end
   * @returns {Moment}
   */
  getFetchEnd(end: Moment): Moment {
    if (!this.cacheEnd) {
      return end;
    }

    return end.isAfter(this.cacheEnd) ? end : this.cacheEnd;
  }


  get(meetingId: string): Meeting {
    return this.idCache.get(meetingId);
  }


  put(meeting: Meeting): Meeting {
    return this.cacheMeeting(meeting);
  }


  remove(meetingId: string): Meeting|null {
    return this.evictMeeting(meetingId);
  }


  cacheMeetings(meetings: Meeting[]) {
    logger.trace('SubCache::cacheMeetings()');
    const meetingIds = meetings.map(meeting => meeting.id);
    meetings.forEach(this.cacheMeeting.bind(this));
    this.reconcileAndEvict(meetingIds);
  }


  getMeetings(start: Moment, end: Moment): Promise<Meeting[]> {
    return new Promise((resolve) => {
      const owner = this.attendee.email;
      const roomName = this.attendee.name;
      const participantMeetings = this.participantCache.get(owner) || [];
      logger.debug(`SubCache::getMeetings(${owner}) by participant:`, participantMeetings.map(m => m.id));
      const originalRoomMeetings = this.roomCache.get(roomName) || [];
      logger.debug(`SubCache::getMeetings(${owner}) by room:`, participantMeetings.map(m => m.id));
      const roomMeetings = originalRoomMeetings || [];

      const meetingIdMap = new Map<string, Meeting>();
      participantMeetings.forEach(meeting => meetingIdMap.set(meeting.id, meeting));
      roomMeetings.forEach(meeting => meetingIdMap.set(meeting.id, meeting));

      const meetings =  Array.from(meetingIdMap.values()) || [];
      logger.debug(`SubCache::getMeetings(${owner}) filter is:`, start, end);

      const filtered =  meetings.filter(meeting => isMeetingWithinRange(meeting, start, end));
      logger.debug(`SubCache::getMeetings(${owner}) filtered:`, filtered.map(m => m.id));

      return resolve(filtered);
    });
  }


  private wasEvicted(id: string): boolean {
    return this.evictedIds.has(id);
  }

  private addToAndCheckEvicted(id: string): boolean {
    if (this.wasEvicted(id)) {
      return false;
    }

    this.evictedIds.add(id);
    return true;
  }


  private updateCacheStart(_start: moment.Moment): boolean {
    const start = _start.clone().startOf('day');
    if (!this.cacheStart || start.isBefore(this.cacheStart)) {
      this.cacheStart = start;
      logger.debug(`${this.attendee.email} updated start`, this.cacheStart);
      return true;
    }

    logger.debug(`${this.attendee.email} will use existing start`, this.cacheStart);
    return false;
  }


  private updateCacheEnd(_end: moment.Moment): boolean {
    const end = _end.clone().endOf('day');
    if (!this.cacheEnd || end.isAfter(this.cacheEnd)) {
      this.cacheEnd = end;
      logger.debug(`${this.attendee.email} updated end`, this.cacheEnd);
      return true;
    }

    logger.debug(`${this.attendee.email} will use existing end`, this.cacheEnd);
    return false;
  }


  private reconcileAndEvict(meetingIds: string[]) {
    const existingMeetingIds = new Set(this.idCache.keys());
    const updatedMeetingIds = new Set(meetingIds);

    logger.debug(`Reconciling ${this.attendee.email} cache - existing:`, existingMeetingIds.size, 'updated:', updatedMeetingIds.size);
    // throw new Error('fail');
    updatedMeetingIds.forEach(id => existingMeetingIds.delete(id));
    existingMeetingIds.forEach(id => this.evictMeeting(id));
  }


  private cacheMeeting(meeting: Meeting) {
    if (this.wasEvicted(meeting.id)) {
      // Don't attempt to cache again what we already evicted
      logger.info(`Attempting to cache(${this.attendee.email}) already evicted ${meeting.id}`);
      return;
    }

    this.idCache.put(meeting);
    this.participantCache.put(meeting);
    this.roomCache.put(meeting);
    this.startDateCache.put(meeting);
    this.endDateCache.put(meeting);

    this.updateCacheStart(meeting.start);
    this.updateCacheEnd(meeting.end);

    logger.info(`Caching meeting(${this.attendee.email}) :`, meeting.id, meeting.title, meeting.location);
    logger.debug('id keys', this.idCache.keys());
    logger.debug('participant keys', this.participantCache.keys());
    logger.debug('room keys', this.roomCache.keys());
    return meeting;
  }


  private evictMeeting(id: string): Meeting|null {
    if (!this.addToAndCheckEvicted(id)) {
      // Already evicted
      return;
    }

    const meeting = this.idCache.get(id);
    if (!meeting) {
      return null;
    }

    logger.info(`Evicting meeting ${this.attendee.email}`, id);
    this.idCache.remove(meeting);
    this.participantCache.remove(meeting);
    this.roomCache.remove(meeting);
    this.startDateCache.remove(meeting);
    this.endDateCache.remove(meeting);

    return meeting;
  }


  isCacheWithinBound(start: Moment, end: Moment) {
    const isWithinBounds = start.isSameOrAfter(this.cacheStart) && end.isSameOrBefore(this.cacheEnd);
    if (!isWithinBounds) {
      logger.debug(`isCacheWithinBound(${this.attendee.email})`, this.cacheStart, 'against', start);
      logger.debug(`isCacheWithinBound(${this.attendee.email})`, this.cacheEnd, 'against', end);
    }
    return isWithinBounds;
  }
}

