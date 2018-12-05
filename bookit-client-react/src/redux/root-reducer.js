import { combineReducers } from 'redux'

import {
  routerReducer as router,
} from 'react-router-redux'

import {
  reducer as form,
} from 'redux-form'

import {
  reducer as api,
} from './api'

import {
  reducer as app,
} from './app'

import {
  reducer as auth,
} from './auth'

import {
  reducer as booking,
} from './booking'

export const rootReducer = combineReducers({
  ...api,
  ...app,
  ...auth,
  ...booking,
  form,
  router,
})
