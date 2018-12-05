import { Map } from 'immutable'

import { handleActions } from 'redux-actions'

export const app = handleActions({
  SET_SELECTED_LOCATION: (state, action) => state.set('selectedLocation', action.payload),
}, Map({ selectedLocation: 'b1177996-75e2-41da-a3e9-fcdd75d1ab31' }))

export const reducer = {
  app,
}
