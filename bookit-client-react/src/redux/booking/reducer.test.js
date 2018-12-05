import { bookingInstance } from './reducer'

describe('reducers/booking', () => {
  describe('#bookingInstance(state, action)', () => {
    it('handles CREATE_BOOKING_SUCCESS', () => {
      const state = bookingInstance(null, { type: 'CREATE_BOOKING_SUCCESS', payload: { result: ['abc'], entities: { bookings: { abc: { id: 'abc' } } } } })
      expect(state).to.deep.equal({ id: 'abc' })
    })

    it('handles CREATE_BOOKING_PENDING', () => {
      const state = bookingInstance({ id: 'abc' }, { type: 'CREATE_BOOKING_PENDING' })
      expect(state).to.be.null
    })
  })
})
