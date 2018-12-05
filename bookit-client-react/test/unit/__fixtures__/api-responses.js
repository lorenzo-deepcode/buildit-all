import { Map, Set } from 'immutable'

export const makeEntityState = () => Map({
  locations: Map({ entities: Map(), result: Set() }),
  bookables: Map({ entities: Map(), result: Set() }),
  bookings: Map({ entities: Map(), result: Set() }),
  users: Map({ entities: Map(), result: Set() }),
})

export const locationResponse = {
  entities: {
    locations: {
      'b1177996-75e2-41da-a3e9-fcdd75d1ab31': {
        id: 'b1177996-75e2-41da-a3e9-fcdd75d1ab31',
        name: 'NYC',
        timeZone: 'America/New_York',
      },
      '43ec3f7d-348d-427f-8c13-102ca0362a62': {
        id: '43ec3f7d-348d-427f-8c13-102ca0362a62',
        name: 'LON',
        timeZone: 'Europe/London',
      },
    },
  },
  result: {
    locations: [
      'b1177996-75e2-41da-a3e9-fcdd75d1ab31',
      '43ec3f7d-348d-427f-8c13-102ca0362a62',
    ],
  },
}

export const bookableResponse = {
  entities: {
    bookables: {
      'cd87ee34-b393-4400-a1c9-d91278d4b8ee': {
        id: 'cd87ee34-b393-4400-a1c9-d91278d4b8ee',
        name: 'Dev Red',
        location: 'b1177996-75e2-41da-a3e9-fcdd75d1ab31',
        disposition: {
          closed: false,
          reason: '',
        },
      },
      'bf16f7d9-d0ee-4333-86ff-5a97c75b4424': {
        id: 'bf16f7d9-d0ee-4333-86ff-5a97c75b4424',
        name: 'Dev Blue',
        location: 'b1177996-75e2-41da-a3e9-fcdd75d1ab31',
        disposition: {
          closed: false,
          reason: '',
        },
      },
      'bfa745f7-cb86-493a-98b4-984173a9ab01': {
        id: 'bfa745f7-cb86-493a-98b4-984173a9ab01',
        name: 'Dev White',
        location: 'b1177996-75e2-41da-a3e9-fcdd75d1ab31',
        disposition: {
          closed: false,
          reason: '',
        },
      },
      '3aceeedc-5302-4b32-b653-a7ee1d8eab6c': {
        id: '3aceeedc-5302-4b32-b653-a7ee1d8eab6c',
        name: 'Dev Black',
        location: 'b1177996-75e2-41da-a3e9-fcdd75d1ab31',
        disposition: {
          closed: false,
          reason: '',
        },
      },
      'aab6d676-d3cb-4b9b-b285-6e63058aeda8': {
        id: 'aab6d676-d3cb-4b9b-b285-6e63058aeda8',
        name: 'Red Room',
        location: 'b1177996-75e2-41da-a3e9-fcdd75d1ab31',
        disposition: {
          closed: false,
          reason: '',
        },
      },
      '1c824c61-7539-41d7-b723-d4447826ba50': {
        id: '1c824c61-7539-41d7-b723-d4447826ba50',
        name: 'Black Room',
        location: 'b1177996-75e2-41da-a3e9-fcdd75d1ab31',
        disposition: {
          closed: false,
          reason: '',
        },
      },
      '23787564-e99d-4741-b285-4d17cc29bf8d': {
        id: '23787564-e99d-4741-b285-4d17cc29bf8d',
        name: 'Blue Room',
        location: 'b1177996-75e2-41da-a3e9-fcdd75d1ab31',
        disposition: {
          closed: false,
          reason: '',
        },
      },
      'a7b68976-8dda-44f2-8e39-4e2b6c3514cd': {
        id: 'a7b68976-8dda-44f2-8e39-4e2b6c3514cd',
        name: 'Green Room',
        location: 'b1177996-75e2-41da-a3e9-fcdd75d1ab31',
        disposition: {
          closed: false,
          reason: '',
        },
      },
      '25708e84-cf1b-45aa-b062-0af903328a52': {
        id: '25708e84-cf1b-45aa-b062-0af903328a52',
        name: 'White Room',
        location: 'b1177996-75e2-41da-a3e9-fcdd75d1ab31',
        disposition: {
          closed: false,
          reason: '',
        },
      },
      'cc4bd7e5-00f6-4903-86a2-abf5423edb84': {
        id: 'cc4bd7e5-00f6-4903-86a2-abf5423edb84',
        name: 'Yellow Room',
        location: 'b1177996-75e2-41da-a3e9-fcdd75d1ab31',
        disposition: {
          closed: true,
          reason: 'Closed for remodeling',
        },
      },
    },
  },
  result: {
    bookables: [
      'cd87ee34-b393-4400-a1c9-d91278d4b8ee',
      'bf16f7d9-d0ee-4333-86ff-5a97c75b4424',
      'bfa745f7-cb86-493a-98b4-984173a9ab01',
      '3aceeedc-5302-4b32-b653-a7ee1d8eab6c',
      'aab6d676-d3cb-4b9b-b285-6e63058aeda8',
      '1c824c61-7539-41d7-b723-d4447826ba50',
      '23787564-e99d-4741-b285-4d17cc29bf8d',
      'a7b68976-8dda-44f2-8e39-4e2b6c3514cd',
      '25708e84-cf1b-45aa-b062-0af903328a52',
      'cc4bd7e5-00f6-4903-86a2-abf5423edb84',
    ],
  },
}

export const bookingResponse = {
  entities: {
    users: {
      '160e0263-4f83-4a99-a2e5-177cd7e96d16': {
        id: 'ff9391f6-a99b-43c4-8e75-9c91bada5397',
        externalId: '160e0263-4f83-4a99-a2e5-177cd7e96d16',
        name: 'Doe Jane',
      },
      'aea828cc-8895-4ca6-a1a9-5d3e1a2ffd30': {
        id: '18420ed4-4ec5-4ae6-8085-d21bb8440527',
        externalId: 'aea828cc-8895-4ca6-a1a9-5d3e1a2ffd30',
        name: ' Bruce Springsteen',
      },
    },
    bookings: {
      'e081f498-151b-49bf-a302-6cf248c991f3': {
        id: 'e081f498-151b-49bf-a302-6cf248c991f3',
        subject: 'My Booking',
        start: '2017-12-17T00:00',
        end: '2017-12-17T01:00',
        bookable: 'cd87ee34-b393-4400-a1c9-d91278d4b8ee',
        user: '160e0263-4f83-4a99-a2e5-177cd7e96d16',
      },
      '989fa334-7b8c-4dec-8be7-adf5e2302f39': {
        id: '989fa334-7b8c-4dec-8be7-adf5e2302f39',
        subject: 'Another Booking',
        start: '2017-12-18T01:00',
        end: '2017-12-18T02:00',
        bookable: 'cd87ee34-b393-4400-a1c9-d91278d4b8ee',
        user: '160e0263-4f83-4a99-a2e5-177cd7e96d16',
      },
      'c52c0fd4-9fdc-4d55-973c-2ba340c8edf6': {
        id: 'c52c0fd4-9fdc-4d55-973c-2ba340c8edf6',
        subject: 'Plan All Things',
        start: '2017-12-18T03:00',
        end: '2017-12-18T04:00',
        bookable: 'bf16f7d9-d0ee-4333-86ff-5a97c75b4424',
        user: '160e0263-4f83-4a99-a2e5-177cd7e96d16',
      },
      '9c73c6a9-b08d-416f-a401-d7c8a8279d13': {
        id: '9c73c6a9-b08d-416f-a401-d7c8a8279d13',
        subject: 'Execute Proletariat',
        start: '2017-12-18T07:00',
        end: '2017-12-18T08:00',
        bookable: 'bf16f7d9-d0ee-4333-86ff-5a97c75b4424',
        user: '160e0263-4f83-4a99-a2e5-177cd7e96d16',
      },
      '2e46deec-a1d7-4842-a3e3-633032b50bf4': {
        id: '2e46deec-a1d7-4842-a3e3-633032b50bf4',
        subject: 'Wash Hands',
        start: '2017-12-19T00:00',
        end: '2017-12-19T01:00',
        bookable: 'bfa745f7-cb86-493a-98b4-984173a9ab01',
        user: '160e0263-4f83-4a99-a2e5-177cd7e96d16',
      },
      'c04a27aa-8f60-490f-95eb-240094f233ac': {
        id: 'c04a27aa-8f60-490f-95eb-240094f233ac',
        subject: 'My Bookable',
        start: '2019-01-19T20:31',
        end: '2019-01-19T20:32',
        bookable: 'aab6d676-d3cb-4b9b-b285-6e63058aeda8',
        user: 'aea828cc-8895-4ca6-a1a9-5d3e1a2ffd30',
      },
      'ce114724-393e-4668-905d-16db6b2323c4': {
        id: 'ce114724-393e-4668-905d-16db6b2323c4',
        subject: 'My Bookable',
        start: '2018-08-25T15:37',
        end: '2018-08-25T15:38',
        bookable: 'aab6d676-d3cb-4b9b-b285-6e63058aeda8',
        user: 'aea828cc-8895-4ca6-a1a9-5d3e1a2ffd30',
      },
      'dbc3ecf2-c4a7-4243-ab8b-5d19413f78a8': {
        id: 'dbc3ecf2-c4a7-4243-ab8b-5d19413f78a8',
        subject: 'My Bookable',
        start: '2018-04-11T02:40',
        end: '2018-04-11T02:41',
        bookable: 'aab6d676-d3cb-4b9b-b285-6e63058aeda8',
        user: 'aea828cc-8895-4ca6-a1a9-5d3e1a2ffd30',
      },
      'e06a5f69-86e6-4310-9ce4-353fbacd578d': {
        id: 'e06a5f69-86e6-4310-9ce4-353fbacd578d',
        subject: 'My Bookable',
        start: '2018-06-10T19:03',
        end: '2018-06-10T19:04',
        bookable: 'aab6d676-d3cb-4b9b-b285-6e63058aeda8',
        user: 'aea828cc-8895-4ca6-a1a9-5d3e1a2ffd30',
      },
      'b605daa1-2203-4763-81b8-84ea94c3d999': {
        id: 'b605daa1-2203-4763-81b8-84ea94c3d999',
        subject: 'My Bookable',
        start: '2019-07-25T06:30',
        end: '2019-07-25T06:31',
        bookable: 'aab6d676-d3cb-4b9b-b285-6e63058aeda8',
        user: 'aea828cc-8895-4ca6-a1a9-5d3e1a2ffd30',
      },
      'bdd2661e-38a7-493a-a15b-bba0b0d47608': {
        id: 'bdd2661e-38a7-493a-a15b-bba0b0d47608',
        subject: 'My Bookable',
        start: '2018-08-06T02:46',
        end: '2018-08-06T02:47',
        bookable: 'aab6d676-d3cb-4b9b-b285-6e63058aeda8',
        user: 'aea828cc-8895-4ca6-a1a9-5d3e1a2ffd30',
      },
      'eb358338-fb79-42d7-a93f-e55c5761a82c': {
        id: 'eb358338-fb79-42d7-a93f-e55c5761a82c',
        subject: 'My Bookable',
        start: '2019-06-18T04:42',
        end: '2019-06-18T04:43',
        bookable: 'aab6d676-d3cb-4b9b-b285-6e63058aeda8',
        user: 'aea828cc-8895-4ca6-a1a9-5d3e1a2ffd30',
      },
      '865202df-f696-4093-bb3b-073f226549a0': {
        id: '865202df-f696-4093-bb3b-073f226549a0',
        subject: 'My Bookable',
        start: '2019-11-15T11:08',
        end: '2019-11-15T11:09',
        bookable: 'aab6d676-d3cb-4b9b-b285-6e63058aeda8',
        user: 'aea828cc-8895-4ca6-a1a9-5d3e1a2ffd30',
      },
      'f31c8d36-909c-4a38-a730-0224a1883751': {
        id: 'f31c8d36-909c-4a38-a730-0224a1883751',
        subject: 'My Bookable for Next Week',
        start: '2017-12-25T18:25',
        end: '2017-12-25T18:26',
        bookable: 'aab6d676-d3cb-4b9b-b285-6e63058aeda8',
        user: 'aea828cc-8895-4ca6-a1a9-5d3e1a2ffd30',
      },
    },
  },
  result: {
    bookings: [
      'e081f498-151b-49bf-a302-6cf248c991f3',
      '989fa334-7b8c-4dec-8be7-adf5e2302f39',
      'c52c0fd4-9fdc-4d55-973c-2ba340c8edf6',
      '9c73c6a9-b08d-416f-a401-d7c8a8279d13',
      '2e46deec-a1d7-4842-a3e3-633032b50bf4',
      'c04a27aa-8f60-490f-95eb-240094f233ac',
      'ce114724-393e-4668-905d-16db6b2323c4',
      'dbc3ecf2-c4a7-4243-ab8b-5d19413f78a8',
      'e06a5f69-86e6-4310-9ce4-353fbacd578d',
      'b605daa1-2203-4763-81b8-84ea94c3d999',
      'bdd2661e-38a7-493a-a15b-bba0b0d47608',
      'eb358338-fb79-42d7-a93f-e55c5761a82c',
      '865202df-f696-4093-bb3b-073f226549a0',
      'f31c8d36-909c-4a38-a730-0224a1883751',
    ],
    users: [
      '160e0263-4f83-4a99-a2e5-177cd7e96d16',
      'aea828cc-8895-4ca6-a1a9-5d3e1a2ffd30',
    ],
  },
}

export const createBookingResponse = {
  entities: {
    users: {
      'aea828cc-8895-4ca6-a1a9-5d3e1a2ffd30': {
        id: '18420ed4-4ec5-4ae6-8085-d21bb8440527',
        externalId: 'aea828cc-8895-4ca6-a1a9-5d3e1a2ffd30',
        name: ' Bruce Springsteen',
      },
    },
    bookings: {
      '8916995d-f6de-4664-8fa3-2090f807069b': {
        id: '8916995d-f6de-4664-8fa3-2090f807069b',
        subject: 'An Event',
        start: '2017-12-19T17:00',
        end: '2017-12-19T18:00',
        bookable: 'cd87ee34-b393-4400-a1c9-d91278d4b8ee',
        user: 'aea828cc-8895-4ca6-a1a9-5d3e1a2ffd30',
      },
    },
  },
  result: {
    bookings: [
      '8916995d-f6de-4664-8fa3-2090f807069b',
    ],
    users: [
      'aea828cc-8895-4ca6-a1a9-5d3e1a2ffd30',
    ],
  },
}
