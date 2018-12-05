import { Map } from 'immutable'

import {
  makeHeaders,
  getAllLocations,
  // getAllBookables,
  // getAllBookings,
  // getAvailability,
  // createBooking,
  // deleteBooking
} from './actions'

/**
 * EHHHHHHHHHHHHHHHHHHHHHHHHHHHH... Not sure how to test this module in a realistic way.
 */

describe('api/actions', () => {
  describe('#makeHeaders(withAuth = true, withJSON = true)', () => {
    const state = { tokens: Map({ authn: 'abc' }) }

    it('makes headers with default arguments', () => {
      const actual = makeHeaders()(state)

      expect(Object.keys(actual)).to.include('Authorization')
      expect(Object.keys(actual)).to.not.include('Content-Type')
    })

    it('makes headers with `withAuth` and `withJSON` passed as `true`', () => {
      const actual = makeHeaders(true, true)(state)

      expect(Object.keys(actual)).to.include('Authorization')
      expect(Object.keys(actual)).to.include('Content-Type')
    })

    it('makes headers with `withAuth` `false` and `withJSON` passed as `true`', () => {
      const actual = makeHeaders(false, true)(state)

      expect(Object.keys(actual)).to.not.include('Authorization')
      expect(Object.keys(actual)).to.include('Content-Type')
    })
  })

  describe('#getAllLocations()', () => {
    it('returns an action', () => {
      const actual = getAllLocations()
      console.log(actual)
      expect(1).to.equal(1)
    })
  })

  describe('#getAllBookables()', () => {})

  describe('#getAllBookings()', () => {})

  describe('#getAvailability(start, end)', () => {})

  describe('#createBooking(booking)', () => {})

  describe('#deleteBooking(bookingId)', () => {})
})
