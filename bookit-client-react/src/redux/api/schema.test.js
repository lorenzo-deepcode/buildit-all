import { normalize } from 'normalizr'

import {
  locationSchema,
  bookableSchema,
  bookingSchema,
  userSchema,
  // normalizeLocations,
  // normalizeBookables,
  normalizeBookings,
  normalizeAvailability,
  // normalizeBooking,
  // availabilitySchema,
  // normalizeAvailability,
} from './schema'

describe('api/schema', () => {
  describe('location', () => {
    it('normalizes a single location entity', () => {
      const raw = { id: 'b1177996-75e2-41da-a3e9-fcdd75d1ab31', name: 'NYC', timeZone: 'America/New_York' }
      const actual = normalize(raw, locationSchema)

      expect(actual.result).to.equal(raw.id)
    })
  })

  describe('bookable', () => {
    it('normalizes a single bookable entity', () => {
      const raw = { id: 'cd87ee34-b393-4400-a1c9-d91278d4b8ee', location: { 'id': 'b1177996-75e2-41da-a3e9-fcdd75d1ab31' }, name: 'Dev Red', disposition: { closed: false, reason: ''}, bookings:[] }
      const actual = normalize(raw, bookableSchema)

      expect(actual.result).to.equal(raw.id)
      expect(actual.entities.bookables[raw.id].location).to.equal(raw.location.id)
    })
  })

  describe('booking', () => {
    it('normalizes a single booking entity and associated user entity', () => {
      const raw = { id: 'e081f498-151b-49bf-a302-6cf248c991f3', bookable: { 'id': 'cd87ee34-b393-4400-a1c9-d91278d4b8ee' }, subject: 'My Booking', start: '2017-12-17T00:00', end: '2017-12-17T01:00', user: { id: 'ff9391f6-a99b-43c4-8e75-9c91bada5397', name: 'Doe Jane', externalId: '160e0263-4f83-4a99-a2e5-177cd7e96d16' } }
      const actual = normalize(raw, bookingSchema)

      expect(actual.result).to.equal(raw.id)
      expect(Object.keys(actual.entities)).to.contain('bookings')
      expect(Object.keys(actual.entities)).to.contain('users')
    })
  })

  describe('user', () => {
    it('normalizes a single user entity', () => {
      const raw = { id: 'ff9391f6-a99b-43c4-8e75-9c91bada5397', name: 'Doe Jane', externalId: '160e0263-4f83-4a99-a2e5-177cd7e96d16' }
      const actual = normalize(raw, userSchema)

      expect(actual.result).to.equal(raw.externalId)
    })
  })

  describe('#normalizeLocations()', () => {})

  describe('#normalizeBookables()', () => {})

  describe('#normalizeBookings()', () => {
    it('should normalize and process a `getAllBookings` API response', () => {
      const raw = [{ id: 'f31c8d36-909c-4a38-a730-0224a1883751', bookable: { 'id': 'aab6d676-d3cb-4b9b-b285-6e63058aeda8' }, subject: 'My Bookable for Next Week', start: '2017-12-25T18:25', end: '2017-12-25T18:26', user: { id:'18420ed4-4ec5-4ae6-8085-d21bb8440527', name: 'Bruce Springsteen', externalId: 'aea828cc-8895-4ca6-a1a9-5d3e1a2ffd30' } } ]
      const expected = { entities: { bookings: { 'f31c8d36-909c-4a38-a730-0224a1883751': { id: 'f31c8d36-909c-4a38-a730-0224a1883751', subject: 'My Bookable for Next Week', start: '2017-12-25T18:25', end: '2017-12-25T18:26', bookable: 'aab6d676-d3cb-4b9b-b285-6e63058aeda8', user: 'aea828cc-8895-4ca6-a1a9-5d3e1a2ffd30' } }, users: { 'aea828cc-8895-4ca6-a1a9-5d3e1a2ffd30': { id: '18420ed4-4ec5-4ae6-8085-d21bb8440527', externalId: 'aea828cc-8895-4ca6-a1a9-5d3e1a2ffd30', name: 'Bruce Springsteen' } } }, result: { bookings: [ 'f31c8d36-909c-4a38-a730-0224a1883751' ], users: [ 'aea828cc-8895-4ca6-a1a9-5d3e1a2ffd30' ] } }
      const actual = normalizeBookings(raw)

      expect(actual).to.deep.equal(expected)
    })
    it('should return a collection of entities and results for both users and bookings even if the API responded with an empty list', () => {
      const raw = []
      const expected = { entities: { users: {}, bookings: {} }, result: { users: [], bookings: [] } }
      const actual = normalizeBookings(raw)

      expect(actual).to.deep.equal(expected)
    })
  })

  describe('#normalizeBooking()', () => {})

  describe('#availabilitySchema()', () => {
    it('should get data of locations and bookables, start end end time of the event and return normilized availability for each resourse', () => {
      const data = [{"location":{"name":"NYC","timeZone":"America/New_York","id":"b1177996-75e2-41da-a3e9-fcdd75d1ab31","timezoneDisplayName":"Eastern Time"},"name":"Black Room","disposition":{"closed":false,"reason":""},"id":"1c824c61-7539-41d7-b723-d4447826ba50","bookings":[]},{"location":{"name":"NYC","timeZone":"America/New_York","id":"b1177996-75e2-41da-a3e9-fcdd75d1ab31","timezoneDisplayName":"Eastern Time"},"name":"Blue Room","disposition":{"closed":false,"reason":""},"id":"23787564-e99d-4741-b285-4d17cc29bf8d","bookings":[]},{"location":{"name":"NYC","timeZone":"America/New_York","id":"b1177996-75e2-41da-a3e9-fcdd75d1ab31","timezoneDisplayName":"Eastern Time"},"name":"Green Room","disposition":{"closed":false,"reason":""},"id":"a7b68976-8dda-44f2-8e39-4e2b6c3514cd","bookings":[{"bookable":{"location":{"name":"NYC","timeZone":"America/New_York","id":"b1177996-75e2-41da-a3e9-fcdd75d1ab31","timezoneDisplayName":"Eastern Time"},"name":"Green Room","disposition":{"closed":false,"reason":""},"id":"a7b68976-8dda-44f2-8e39-4e2b6c3514cd"},"subject":"mm","start":"2018-04-24T15:00","end":"2018-04-24T16:00","user":{"externalId":"a55aea54-9464-4b4b-90d5-7605790a6f38","id":"dc89c8b4-d172-4870-9a1b-a9a3d35b994e","name":"Gregory Soloshchenko (Digital)"},"id":"2c374a26-c2dd-4862-8327-6778b05beb05","startTimezoneAbbreviation":"EDT","endTimezoneAbbreviation":"EDT"},{"bookable":{"location":{"name":"NYC","timeZone":"America/New_York","id":"b1177996-75e2-41da-a3e9-fcdd75d1ab31","timezoneDisplayName":"Eastern Time"},"name":"Green Room","disposition":{"closed":false,"reason":""},"id":"a7b68976-8dda-44f2-8e39-4e2b6c3514cd"},"subject":"nn","start":"2018-04-24T14:00","end":"2018-04-24T14:59","user":{"externalId":"a55aea54-9464-4b4b-90d5-7605790a6f38","id":"dc89c8b4-d172-4870-9a1b-a9a3d35b994e","name":"Gregory Soloshchenko (Digital)"},"id":"aacc1727-ffc9-4ead-abed-068e8ab0c5b4","startTimezoneAbbreviation":"EDT","endTimezoneAbbreviation":"EDT"}]},{"location":{"name":"NYC","timeZone":"America/New_York","id":"b1177996-75e2-41da-a3e9-fcdd75d1ab31","timezoneDisplayName":"Eastern Time"},"name":"Randolph Room","disposition":{"closed":true,"reason":"Out of beer!"},"id":"86d0eb7c-cce0-400a-b413-72f19ba11230","bookings":[]},{"location":{"name":"NYC","timeZone":"America/New_York","id":"b1177996-75e2-41da-a3e9-fcdd75d1ab31","timezoneDisplayName":"Eastern Time"},"name":"Red Room","disposition":{"closed":false,"reason":""},"id":"aab6d676-d3cb-4b9b-b285-6e63058aeda8","bookings":[{"bookable":{"location":{"name":"NYC","timeZone":"America/New_York","id":"b1177996-75e2-41da-a3e9-fcdd75d1ab31","timezoneDisplayName":"Eastern Time"},"name":"Red Room","disposition":{"closed":false,"reason":""},"id":"aab6d676-d3cb-4b9b-b285-6e63058aeda8"},"subject":"some","start":"2018-04-24T12:00","end":"2018-04-24T13:00","user":{"externalId":"a55aea54-9464-4b4b-90d5-7605790a6f38","id":"dc89c8b4-d172-4870-9a1b-a9a3d35b994e","name":"Gregory Soloshchenko (Digital)"},"id":"fa6a62b6-94d9-4cc3-965d-37928a05d228","startTimezoneAbbreviation":"EDT","endTimezoneAbbreviation":"EDT"}]},{"location":{"name":"NYC","timeZone":"America/New_York","id":"b1177996-75e2-41da-a3e9-fcdd75d1ab31","timezoneDisplayName":"Eastern Time"},"name":"White Room","disposition":{"closed":false,"reason":""},"id":"25708e84-cf1b-45aa-b062-0af903328a52","bookings":[]},{"location":{"name":"NYC","timeZone":"America/New_York","id":"b1177996-75e2-41da-a3e9-fcdd75d1ab31","timezoneDisplayName":"Eastern Time"},"name":"Yellow Room","disposition":{"closed":true,"reason":"Not bookable (ad-hoc)"},"id":"cc4bd7e5-00f6-4903-86a2-abf5423edb84","bookings":[]}]
      const start = '2018-04-24T13:08:41'
      const end = '2018-04-24T14:08:41'
      const result = [{"bookableId":"1c824c61-7539-41d7-b723-d4447826ba50","name":"Black Room","closed":false,"reason":"","freeUntil":null},{"bookableId":"23787564-e99d-4741-b285-4d17cc29bf8d","name":"Blue Room","closed":false,"reason":"","freeUntil":null},{"bookableId":"aab6d676-d3cb-4b9b-b285-6e63058aeda8","name":"Red Room","closed":false,"reason":"","freeUntil":null},{"bookableId":"25708e84-cf1b-45aa-b062-0af903328a52","name":"White Room","closed":false,"reason":"","freeUntil":null},{"bookableId":"a7b68976-8dda-44f2-8e39-4e2b6c3514cd","name":"Green Room","closed":true,"reason":"Booked by Gregory Soloshchenko (Digital) until 14:59","freeUntil":"2018-04-24T14:00"},{"bookableId":"86d0eb7c-cce0-400a-b413-72f19ba11230","name":"Randolph Room","closed":true,"reason":"Out of beer!","freeUntil":null},{"bookableId":"cc4bd7e5-00f6-4903-86a2-abf5423edb84","name":"Yellow Room","closed":true,"reason":"Not bookable (ad-hoc)","freeUntil":null}]

      expect(normalizeAvailability(data, start, end)).to.deep.equal(result)
    })

  })

  describe('#normalizeAvailability()', () => {})
})
