import { Map } from 'immutable'

import { compose } from 'redux'

import {
  updateLocationEntities,
  updateBookableEntities,
  updateBookingEntities,
} from './reducer'

import {
  makeEntityState,
  locationResponse,
  bookableResponse,
  bookingResponse,
} from 'Fixtures/api-responses'

import {
  getEntities,
  getBookings,
  getBookingIds,
  getBookingEntities,
  getLocations,
  getLocationIds,
  getLocationEntities,
  getBookables,
  getBookableIds,
  getBookableEntities,
  getUsers,
  getUserIds,
  getUserEntities,
  getBookingEntity,
  hasBooking,
  getBookingSubject,
  getBookingStart,
  getBookingEnd,
  getBookingBookable,
  isBookingInPast,
  getBookingBookableName,
  getBookingLocationName,
  getBookingsForDate,
  getLocationEntity,
  getLocationName,
  getLocationTimezone,
  getLocationByName,
  getLocationOptions,
  getBookingsForUserForDate,
  getBookableEntity,
  getBookableId,
  getBookableName,
  getBookableDisposition,
  isBookableClosed,
  getBookableDispositionReason,
  getBookableLocation,
  getBookableLocationName,
  getBookableLocationTimezone,
  getBookablesForLocation,
  getBookingOverlaps,
  getBookablesSortedByAvailability,
} from './selectors'

const entities = compose(
  state => updateBookingEntities(state, { payload: bookingResponse }),
  state => updateBookableEntities(state, { payload: bookableResponse }),
  state => updateLocationEntities(state, { payload: locationResponse })
)(makeEntityState())

const state = { entities }

describe('API selectors', () => {
  describe('#getEntities(state)', () => {
    it('returns the correct value from state', () => {
      const actual = getEntities(state)

      expect(actual).to.deep.equal(entities)
    })
  })

  describe('#getBookings(state)', () => {
    it('returns the correct value from state', () => {
      const actual = getBookings(state)

      expect(actual).to.deep.equal(entities.get('bookings'))
    })
  })

  describe('#getBookingIds(state)', () => {
    it('returns the correct value from state', () => {
      const actual = getBookingIds(state)

      expect(actual).to.deep.equal(entities.getIn(['bookings', 'result']).toArray())
    })
  })

  describe('#getBookingEntities(state)', () => {
    it('returns the correct value from state', () => {
      const actual = getBookingEntities(state)

      expect(actual).to.deep.equal(entities.getIn(['bookings', 'entities']))
    })
  })

  describe('#getLocations(state)', () => {
    it('returns the correct value from state', () => {
      const actual = getLocations(state)

      expect(actual).to.deep.equal(entities.get('locations'))
    })
  })

  describe('#getLocationIds(state)', () => {
    it('returns the correct value from state', () => {
      const actual = getLocationIds(state)

      expect(actual).to.deep.equal(entities.getIn(['locations', 'result']).toArray())
    })
  })

  describe('#getLocationEntities(state)', () => {
    it('returns the correct value from state', () => {
      const actual = getLocationEntities(state)

      expect(actual).to.deep.equal(entities.getIn(['locations', 'entities']))
    })
  })

  describe('#getBookables(state)', () => {
    it('returns the correct value from state', () => {
      const actual = getBookables(state)

      expect(actual).to.deep.equal(entities.get('bookables'))
    })
  })

  describe('#getBookableIds(state)', () => {
    it('returns the correct value from state', () => {
      const actual = getBookableIds(state)

      expect(actual).to.deep.equal(entities.getIn(['bookables', 'result']).toArray())
    })
  })

  describe('#getBookableEntities(state)', () => {
    it('returns the correct value from state', () => {
      const actual = getBookableEntities(state)

      expect(actual).to.deep.equal(entities.getIn(['bookables', 'entities']))
    })
  })

  describe('#getUsers(state)', () => {
    it('returns the correct value from state', () => {
      const actual = getUsers(state)

      expect(actual).to.deep.equal(entities.get('users'))
    })
  })

  describe('#getUserIds(state)', () => {
    it('returns the correct value from state', () => {
      const actual = getUserIds(state)

      expect(actual).to.deep.equal(entities.getIn(['users', 'result']).toArray())
    })
  })

  describe('#getUserEntities(state)', () => {
    it('returns the correct value from state', () => {
      const actual = getUserEntities(state)

      expect(actual).to.deep.equal(entities.getIn(['users', 'entities']))
    })
  })

  describe('#getBookingEntity(state, props)', () => {
    it('returns the correct value from state', () => {
      const props = { id: 'e081f498-151b-49bf-a302-6cf248c991f3' }
      const actual = getBookingEntity(state, props)

      expect(actual).to.deep.equal(entities.getIn(['bookings', 'entities', props.id]))
    })
  })

  describe('#hasBooking(state, id)', () => {
    it('returns the correct value from state', () => {
      const id = 'e081f498-151b-49bf-a302-6cf248c991f3'
      const actual = hasBooking(state, id)

      expect(actual).to.be.true
    })
  })

  describe('#getBookingSubject(state, props)', () => {
    it('returns the correct value from state', () => {
      const props = { id: 'e081f498-151b-49bf-a302-6cf248c991f3' }
      const actual = getBookingSubject(state, props)

      expect(actual).to.equal(entities.getIn(['bookings', 'entities', props.id, 'subject']))
    })
  })

  describe('#getBookingStart(state, props)', () => {
    it('returns the correct value from state', () => {
      const props = { id: 'e081f498-151b-49bf-a302-6cf248c991f3' }
      const actual = getBookingStart(state, props)

      expect(actual).to.equal(entities.getIn(['bookings', 'entities', props.id, 'start']))
    })
  })

  describe('#getBookingEnd(state, props)', () => {
    it('returns the correct value from state', () => {
      const props = { id: 'e081f498-151b-49bf-a302-6cf248c991f3' }
      const actual = getBookingEnd(state, props)

      expect(actual).to.equal(entities.getIn(['bookings', 'entities', props.id, 'end']))
    })
  })

  describe('#getBookingBookable(state, props)', () => {
    it('returns the correct value from state', () => {
      const props = { id: 'e081f498-151b-49bf-a302-6cf248c991f3' }
      const actual = getBookingBookable(state, props)

      expect(actual).to.equal(entities.getIn(['bookings', 'entities', props.id, 'bookable']))
    })
  })

  describe('#isBookingInPast(state, props)', () => {
    it('returns the correct value from state', () => {
      const props = { id: 'e081f498-151b-49bf-a302-6cf248c991f3' }
      const actual = isBookingInPast(state, props)

      expect(actual).to.be.true
    })
  })

  describe('#getBookingBookableName(state, props)', () => {
    it('returns the correct value from state', () => {
      const props = { id: 'e081f498-151b-49bf-a302-6cf248c991f3' }
      const actual = getBookingBookableName(state, props)
      const bookable = getBookingBookable(state, props)

      expect(actual).to.equal(entities.getIn(['bookables', 'entities', bookable, 'name']))
    })
  })

  describe('#getBookingLocationName(state, props)', () => {
    it('returns the correct value from state', () => {
      const props = { id: 'e081f498-151b-49bf-a302-6cf248c991f3' }
      const actual = getBookingLocationName(state, props)
      const bookable = getBookingBookable(state, props)
      const location = getBookableLocation(state, { id: bookable })

      expect(actual).to.equal(entities.getIn(['locations', 'entities', location, 'name']))
    })
  })

  // TODO: Branch miss on line 69 - not sure how to test
  describe('#getBookingsForDate(state, props)', () => {
    it('returns the correct value from state', () => {
      const props = { date: '2017-12-17' }
      const actual = getBookingsForDate(state, props)

      expect(actual).to.exist
    })
  })

  describe('#getLocationEntity(state, props)', () => {
    it('returns the correct value from state', () => {
      const props = { id: 'b1177996-75e2-41da-a3e9-fcdd75d1ab31' }
      const actual = getLocationEntity(state, props)

      expect(actual).to.equal(entities.getIn(['locations', 'entities', props.id]))
    })
  })

  describe('#getLocationName(state, props)', () => {
    it('returns the correct value from state', () => {
      const props = { id: 'b1177996-75e2-41da-a3e9-fcdd75d1ab31' }
      const actual = getLocationName(state, props)

      expect(actual).to.equal(entities.getIn(['locations', 'entities', props.id, 'name']))
    })
  })

  describe('#getLocationTimezone(state, props)', () => {
    it('returns the correct value from state', () => {
      const props = { id: 'b1177996-75e2-41da-a3e9-fcdd75d1ab31' }
      const actual = getLocationTimezone(state, props)

      expect(actual).to.equal(entities.getIn(['locations', 'entities', props.id, 'timeZone']))
    })
  })

  describe('#getLocationByName(state, props)', () => {
    it('returns the correct value from state', () => {
      const props = { name: 'NYC' }
      const actual = getLocationByName(state, props)

      expect(actual).to.equal(entities.getIn(['locations', 'entities', 'b1177996-75e2-41da-a3e9-fcdd75d1ab31']))
    })
  })

  describe('#getLocationOptions(state)', () => {
    it('returns the correct value from state', () => {
      const expected = [
        { id: 'b1177996-75e2-41da-a3e9-fcdd75d1ab31', name: 'NYC' },
        { id: '43ec3f7d-348d-427f-8c13-102ca0362a62', name: 'LON' },
      ]
      const actual = getLocationOptions(state)

      expect(actual).to.have.lengthOf(expected.length)
      expect(actual[0]).to.deep.equal(expected[0])
      expect(actual[1]).to.deep.equal(expected[1])
    })
  })

  describe('#getBookingsForUserForDate(state)', () => {
    it('returns the correct value from state', () => {
      const modifiedState = { ...state, user: Map({ email: 'test@test.com', oid: 'aea828cc-8895-4ca6-a1a9-5d3e1a2ffd30' }) }
      const props = { date: '2017-12-17' }
      const actual = getBookingsForUserForDate(modifiedState, props)

      expect(actual).to.exist
    })
  })

  describe('#getBookableEntity(state)', () => {
    it('returns the correct value from state', () => {
      const props = { id: 'cd87ee34-b393-4400-a1c9-d91278d4b8ee' }
      const actual = getBookableEntity(state, props)

      expect(actual).to.equal(entities.getIn(['bookables', 'entities', props.id]))
    })
  })

  // TODO: Why does this exist.
  describe('#getBookableId(state)', () => {
    it('returns the correct value from state', () => {
      const props = { id: 'cd87ee34-b393-4400-a1c9-d91278d4b8ee' }
      const actual = getBookableId(state, props)

      expect(actual).to.equal(entities.getIn(['bookables', 'entities', props.id, 'id']))
    })
  })

  describe('#getBookableName(state)', () => {
    it('returns the correct value from state', () => {
      const props = { id: 'cd87ee34-b393-4400-a1c9-d91278d4b8ee' }
      const actual = getBookableName(state, props)

      expect(actual).to.equal(entities.getIn(['bookables', 'entities', props.id, 'name']))
    })
  })

  describe('#getBookableDisposition(state)', () => {
    it('returns the correct value from state', () => {
      const props = { id: 'cd87ee34-b393-4400-a1c9-d91278d4b8ee' }
      const actual = getBookableDisposition(state, props)

      expect(actual).to.equal(entities.getIn(['bookables', 'entities', props.id, 'disposition']))
    })
  })

  describe('#isBookableClosed(state)', () => {
    it('returns the correct value from state', () => {
      const props = { id: 'cd87ee34-b393-4400-a1c9-d91278d4b8ee' }
      const actual = isBookableClosed(state, props)

      expect(actual).to.equal(entities.getIn(['bookables', 'entities', props.id, 'disposition', 'closed']))
    })
  })

  describe('#getBookableDispositionReason(state)', () => {
    it('returns the correct value from state', () => {
      const props = { id: 'cd87ee34-b393-4400-a1c9-d91278d4b8ee' }
      const actual = getBookableDispositionReason(state, props)

      expect(actual).to.equal(entities.getIn(['bookables', 'entities', props.id, 'disposition', 'reason']))
    })
  })

  describe('#getBookableLocation(state)', () => {
    it('returns the correct value from state', () => {
      const props = { id: 'cd87ee34-b393-4400-a1c9-d91278d4b8ee' }
      const actual = getBookableLocation(state, props)

      expect(actual).to.equal(entities.getIn(['bookables', 'entities', props.id, 'location']))
    })
  })

  describe('#getBookableLocationName(state)', () => {
    it('returns the correct value from state', () => {
      const props = { id: 'cd87ee34-b393-4400-a1c9-d91278d4b8ee' }
      const locationId = getBookableLocation(state, props)
      const actual = getBookableLocationName(state, props)

      expect(actual).to.equal(entities.getIn(['locations', 'entities', locationId, 'name']))
    })
  })

  describe('#getBookableLocationTimezone(state)', () => {
    it('returns the correct value from state', () => {
      const props = { id: 'cd87ee34-b393-4400-a1c9-d91278d4b8ee' }
      const locationId = getBookableLocation(state, props)
      const actual = getBookableLocationTimezone(state, props)

      expect(actual).to.equal(entities.getIn(['locations', 'entities', locationId, 'timeZone']))
    })
  })

  describe('#getBookablesForLocation(state)', () => {
    it('returns the correct value from state', () => {
      const modifiedState = { ...state, app: Map({ selectedLocation: 'b1177996-75e2-41da-a3e9-fcdd75d1ab31' }) }
      const actual = getBookablesForLocation(modifiedState)

      expect(actual).to.exist
    })
  })

  describe('#getBookingOverlaps(state)', () => {
    it('returns the correct value from state', () => {
      const formValues = { start: '2017-12-19T01:00', end: '2017-12-19T02:00', bookableId: 'abc', subject: 'A Booking' }
      const formState = { form: { booking: { values: formValues } } }
      const modifiedState = { ...state, ...formState, app: Map({ selectedLocation: 'b1177996-75e2-41da-a3e9-fcdd75d1ab31' }) }
      const actual = getBookingOverlaps(modifiedState)

      expect(actual).to.exist
    })
  })

  describe('#getBookablesSortedByAvailability(state)', () => {
    it('returns the correct value from state', () => {
      const formValues = { start: '2017-12-19T01:00', end: '2017-12-19T02:00', bookableId: 'abc', subject: 'A Booking' }
      const formState = { form: { booking: { values: formValues } } }
      const modifiedState = { ...state, ...formState, app: Map({ selectedLocation: 'b1177996-75e2-41da-a3e9-fcdd75d1ab31' }) }
      const actual = getBookablesSortedByAvailability(modifiedState)

      expect(actual).to.exist
    })
  })
})
