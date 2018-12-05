import { Map } from 'immutable'

import {
  getSelectedLocation,
  getRouterLocation,
} from './selectors'

describe('selectors/app', () => {

  describe('#getSelectedLocation(state)', () => {
    it('returns selectedLocation', () => {
      const state = { app: Map({ selectedLocation: '123abc' }) }
      expect(getSelectedLocation(state)).to.equal('123abc')
    })
  })

  describe('#getRouterLocation(state)', () => {
    it('returns the current router location', () => {
      const state = { router: { location: '/home' } }
      expect(getRouterLocation(state)).to.equal('/home')
    })
  })
})
