import { takeEvery } from 'redux-saga/effects'

import { fetchMeetings, createMeeting, cancelMeeting } from './meetings'

import { login, logout } from './auth'

import selectDate from './selectDate'

import {
  LOGIN_START,
  LOGOUT,
  MEETINGS_FETCH_START,
  MEETING_CREATE_START,
  CANCEL_MEETING_START,
  SELECT_DATE,
} from '../actions/actionTypes'

function* rootSaga() {
  yield takeEvery(MEETINGS_FETCH_START, fetchMeetings)
  yield takeEvery(MEETING_CREATE_START, createMeeting)
  yield takeEvery(LOGIN_START, login)
  yield takeEvery(LOGOUT, logout)
  yield takeEvery(CANCEL_MEETING_START, cancelMeeting)
  yield takeEvery(SELECT_DATE, selectDate)
}

export default rootSaga
