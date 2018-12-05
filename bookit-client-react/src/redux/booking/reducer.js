import { handleActions } from 'redux-actions'

export const bookingInstance = handleActions({
  // XXX: The return value below is a hack until we no longer need `bookingInstance`
  CREATE_BOOKING_SUCCESS: (state, action) => action.payload.entities.bookings[action.payload.result[0]],
  CREATE_BOOKING_PENDING: () => null,
}, null)

export const reducer = {
  bookingInstance,
}
