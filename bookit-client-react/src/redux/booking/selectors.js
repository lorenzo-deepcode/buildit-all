import { createSelector } from 'reselect'

import { formValueSelector } from 'redux-form'

import { normalizeDateWithBase, formatDate } from 'Utils'

import { getBookableEntities } from '../api/selectors'

// ### Booking Instance ------------------------------------------------------

export const getBookingInstance = state => state.bookingInstance

export const getBookingInstanceId = createSelector(
  [ getBookingInstance ],
  bookingInstance => bookingInstance && bookingInstance.id
)

// ### Booking Form ----------------------------------------------------------

const bookingFormSelector = formValueSelector('booking')

const getBookingFormBookableId = state => bookingFormSelector(state, 'bookableId')
export const getBookingFormLocation = state => bookingFormSelector(state, 'locationId')
export const getBookingFormDate = state => bookingFormSelector(state, 'date')
export const getBookingFormStart = state => bookingFormSelector(state, 'start')
export const getBookingFormEnd = state => bookingFormSelector(state, 'end')

export const getBookingFormBookableName = createSelector(
  [ getBookingFormBookableId, getBookableEntities ],
  (bookableId, bookables) => bookableId && bookables.getIn([bookableId, 'name'], null)
)

export const getBookingFormDateRange = createSelector(
  [ getBookingFormStart, getBookingFormEnd, getBookingFormDate ],
  (start, end, date) => ({
    end: formatDate(normalizeDateWithBase(end, date), 'YYYY-MM-DDTHH:mm:ss'),
    start: formatDate(normalizeDateWithBase(start, date), 'YYYY-MM-DDTHH:mm:ss'),
  })
)
