import { call, fork, race, take, takeEvery, put, select } from 'redux-saga/effects'

import { toast } from 'react-toastify'

import history from 'History'

import { selectors, actionCreators } from 'Redux'

import * as messages from 'Constants/messages'

export function* showToast(message, type) {
  yield call(
    toast,
    message,
    { type }
  )
}

export function* watchForCreateBooking() {
  while (true) {
    yield take('CREATE_BOOKING_PENDING')

    const { failure, success } = yield race({
      failure: take('CREATE_BOOKING_FAILURE'),
      success: take('CREATE_BOOKING_SUCCESS'),
    })

    if (success) {
      yield call(history.replace, '/bookings')
      yield call(showToast, messages.BOOKING_CREATED_SUCCESS, 'success')
    }

    if (failure) {
      yield call(showToast, failure.payload.response.message, 'error')
    }
  }
}

export function* watchForDeleteBooking() {
  while (true) {
    const action = yield take('DELETE_BOOKING_PENDING')
    if (action.error) {
      yield call(showToast, messages.BOOKING_DELETED_ERROR, 'error')
      //TODO: Not navigate back to bookings if booking deleted errors.
      yield call(history.replace, '/bookings')
    } else {
      const { failure, success, pending } = yield race({
        pending: take('DELETE_BOOKING_PENDING'),
        failure: take('DELETE_BOOKING_FAILURE'),
        success: take('DELETE_BOOKING_SUCCESS'),
      })

      if (success) {
        yield call(history.replace, '/bookings')
        yield call(showToast, messages.BOOKING_DELETED_SUCCESS, 'success')
      }

      if (failure || pending) {
        yield call(showToast, messages.BOOKING_DELETED_ERROR, 'error')
        //TODO: Not navigate back to bookings if booking deleted errors.
        yield call(history.replace, '/bookings')
      }
    }
  }
}

export function* setLocationSaga() {
  const location = yield select(selectors.getLocationByName, { name: 'NYC' })
  if (location) {
    yield put(actionCreators.setSelectedLocation(location.get('id')))
  }
}

export const sagas = function* apiSagas() {
  yield fork(watchForCreateBooking)
  yield fork(watchForDeleteBooking)

  yield takeEvery('GET_LOCATIONS_SUCCESS', setLocationSaga)
}
