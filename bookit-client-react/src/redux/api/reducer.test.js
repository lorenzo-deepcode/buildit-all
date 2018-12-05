import { entities } from './reducer'

import {
  makeEntityState,
  locationResponse,
  bookableResponse,
  bookingResponse,
  createBookingResponse,
} from 'Fixtures/api-responses'

describe('reducers/api', () => {
  describe('#entities(state, action)', () => {
    it('handles GET_LOCATIONS_SUCCESS', () => {
      const state = entities(makeEntityState(), { type: 'GET_LOCATIONS_SUCCESS', payload: locationResponse })

      expect(state.getIn([ 'locations', 'entities' ]).size).to.equal(2)
    })

    it('handles GET_BOOKABLES_SUCCESS', () => {
      const state = entities(makeEntityState(), { type: 'GET_BOOKABLES_SUCCESS', payload: bookableResponse })
      expect(state.getIn([ 'bookables', 'entities' ]).size).to.equal(10)
    })

    it('handles GET_BOOKINGS_SUCCESS', () => {
      const state = entities(makeEntityState(), { type: 'GET_BOOKINGS_SUCCESS', payload: bookingResponse })
      expect(state.getIn([ 'bookings', 'entities' ]).size).to.equal(14)
      expect(state.getIn([ 'users', 'entities' ]).size).to.equal(2)
    })

    it('handles CREATE_BOOKING_SUCCESS', () => {
      const state = entities(makeEntityState(), { type: 'GET_BOOKINGS_SUCCESS', payload: bookingResponse })

      expect(state.getIn([ 'bookings', 'entities' ]).size).to.equal(14)
      expect(state.getIn([ 'users', 'entities' ]).size).to.equal(2)

      const newState = entities(state, { type: 'CREATE_BOOKING_SUCCESS', payload: createBookingResponse })

      expect(newState.getIn([ 'bookings', 'entities' ]).size).to.equal(15)
      expect(newState.getIn([ 'users', 'entities' ]).size).to.equal(2)
    })

    it('handles DELETE_BOOKING_SUCCESS', () => {
      const state = entities(makeEntityState(), { type: 'GET_BOOKINGS_SUCCESS', payload: bookingResponse })

      expect(state.getIn([ 'bookings', 'entities' ]).size).to.equal(14)
      expect(state.getIn([ 'users', 'entities' ]).size).to.equal(2)

      const newState = entities(state, { type: 'DELETE_BOOKING_SUCCESS', payload: 'e081f498-151b-49bf-a302-6cf248c991f3' })

      expect(newState.getIn([ 'bookings', 'entities' ]).size).to.equal(13)
    })
  })
})
