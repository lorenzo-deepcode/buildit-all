import {Room, RoomList} from '../../model/Room';
import {MSGroup} from '../../services/groups/GroupService';
import {MSUser} from '../../services/users/UserService';


let counter = 1;


export function getEmail(name: string, domain: string) {
  return `${name.toLowerCase()}@${domain}`;
}


export function getRoomEmail(name: string, domain: string) {
  return getEmail(`${name}-room`, domain);
}


export const ROOM_COLORS = [
  'Red',
  'Green',
  'White',
  'Black',
  'Yellow',
  'Orange',
  'Cyan',
  'Magenta'
];


export function generateMSGroup(name: string, domain: string): MSGroup {
  return {
      id: 'room group' + counter++,
      description: 'auto-generated group',
      displayName: `${name}-rooms`,
      mail: getRoomEmail(name, domain)
  };
}


export function generateMSUserResource(name: string, domain: string): MSUser {
  return new MSUser('user' + counter++, name, 'auto-generated user resource', getEmail(name, domain));
}


export function generateMSRoomResource(name: string, domain: string): MSUser {
  return new MSUser('room' + counter++, name, 'auto-generated room resource', getRoomEmail(name, domain));
}


export function generateRoomLists(roomNames: string[], domain: string): RoomList[] {
  const rooms = roomNames.map(name => generateMSRoomResource(name, domain));

  return [
    {
      id: '1',
      name: 'nyc-rooms',
      rooms
    }
  ];
}

// TODO: consider this function and the generateTestRoomLists() function and refactor to
// something better.
export function generateMockRoomList(domain: string, roomNames: string[] = ROOM_COLORS) {
  return roomNames.map(room => generateMSRoomResource(room, domain));
}

// TODO:  See TODO on generateMockRoomList().
export function generateTestRoomLists(domain: string): RoomList[] {
  return [
    {
      id: '1',
      name: 'nyc-rooms',
      rooms: [
        generateMSRoomResource('red', domain),
        generateMSRoomResource('black', domain),
        generateMSRoomResource('white', domain),
      ]
    }
  ];
}
