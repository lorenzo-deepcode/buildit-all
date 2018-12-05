import { Map } from 'immutable'

import { app } from './reducer'

describe('reducers/app', () => {

  describe('#app(state, action)', () => {
    it('returns selectedLocation on SET_SELECTED_LOCATION', () => {
      const state = app(Map(), { type: 'SET_SELECTED_LOCATION', payload: 'lemoncurry' })

      expect(state.get('selectedLocation')).to.equal('lemoncurry')
    })
  })
})
