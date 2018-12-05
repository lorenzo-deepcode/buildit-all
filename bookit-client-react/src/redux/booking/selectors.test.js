import { Map, Set, fromJS } from 'immutable'

import {
  getBookingInstance,
  getBookingInstanceId,
  getBookingFormStart,
  getBookingFormEnd,
  getBookingFormLocation,
  getBookingFormBookableName,
  getBookingFormDateRange,
} from './selectors'

describe('booking/selectors', () => {
  const formValues = { date: new Date('2017-12-19T00:00'), start: new Date('2017-12-19T01:00'), end: new Date('2017-12-19T02:00'), bookableId: 'abc', subject: 'A Booking', locationId: 'def' }
  const formState = { form: { booking: { values: formValues } } }

  describe('#getBookingInstance(state)', () => {
    it('returns the correct state', () => {
      const state = { bookingInstance: true }
      expect(getBookingInstance(state)).to.be.true
    })
  })

  describe('#getBookingInstanceId(state)', () => {
    it('returns the correct state', () => {
      const state = { bookingInstance: { id: 'abc' } }
      expect(getBookingInstanceId(state)).to.equal('abc')
    })
  })

  describe('#getBookingFormStart(state)', () => {
    it('returns the correct state', () => {
      expect(getBookingFormStart(formState)).to.equal(formValues.start)
    })
  })

  describe('#getBookingFormEnd(state)', () => {
    it('returns the correct state', () => {
      expect(getBookingFormEnd(formState)).to.equal(formValues.end)
    })
  })

  describe('#getBookingFormLocation(state)', () => {
    it('returns the correct state', () => {
      expect(getBookingFormLocation(formState)).to.equal(formValues.locationId)
    })
  })

  describe('#getBookingFormBookableName(state)', () => {
    it('returns the correct state', () => {
      const combinedState = {
        ...formState,
        entities: Map({ bookables: Map({ entities: fromJS({
          'abc': {
            id: 'abc',
            name: 'A Bookable',
          },
        }), result: Set(['abc']) }) }),
      }

      expect(getBookingFormBookableName(combinedState)).to.equal('A Bookable')
    })

    describe('#getBookingFormDateRange(state)', () => {
      it('returns the correct state', () => {
        const expected = { start: '2017-12-19T01:00:00', end: '2017-12-19T02:00:00' }

        expect(getBookingFormDateRange(formState)).to.deep.equal(expected)
      })
    })
  })})
