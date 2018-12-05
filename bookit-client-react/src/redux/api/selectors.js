import { Map, Set } from 'immutable'

import { formValueSelector } from 'redux-form'

import { createSelector } from 'reselect'
import { createGetSelector } from 'reselect-immutable-helpers'

import { getSelectedLocation } from '../app/selectors'
import { getUserId } from '../auth/selectors'

import { doesRangeOverlap, formatDate, normalizeDateWithBase, isSameDay, compareDates, isBefore } from 'Utils'

// ### Baseline selectors ----------------------------------------------------

export const getEntities = state => state.entities

export const getBookings = state => getEntities(state).get('bookings')
export const getBookingIds = state => getBookings(state).get('result').toArray()
export const getBookingEntities = state => getBookings(state).get('entities', Map())

export const getLocations = state => getEntities(state).get('locations')
export const getLocationIds = state => getLocations(state).get('result').toArray()
export const getLocationEntities = state => getLocations(state).get('entities', Map())

export const getBookables = state => getEntities(state).get('bookables')
export const getBookableIds = state => getBookables(state).get('result').toArray()
export const getBookableEntities = state => getBookables(state).get('entities', Map())

export const getUsers = state => getEntities(state).get('users')
export const getUserIds = state => getUsers(state).get('result').toArray()
export const getUserEntities = state => getUsers(state).get('entities', Map())

// ### Bookings --------------------------------------------------------------

export const getBookingEntity = (state, props) => getBookingEntities(state).get(props.id, Map())

export const hasBooking = (state, id) => getBookings(state).get('result', Set()).includes(id)
export const getBookingSubject = createGetSelector(getBookingEntity, 'subject', null)
export const getBookingStart = createGetSelector(getBookingEntity, 'start', null)
export const getBookingEnd = createGetSelector(getBookingEntity, 'end', null)
export const getBookingBookable = createGetSelector(getBookingEntity, 'bookable', null)

export const isBookingInPast = createSelector(
  [ getBookingEnd ],
  end => end && isBefore(end, new Date)
)

// Private helper for relating a bookable entity to a booking via the booking's bookable id
const getBookingBookableEntity = createSelector(
  [ getBookingBookable, getBookableEntities ],
  (bookingBookable, bookables) => bookables.find((value, key) => key === bookingBookable) || Map()
)

// Private heper for relating a location to a booking via its bookable
const getBookingBookableLocationEntity = createSelector(
  [ getBookingBookableEntity, getLocationEntities ],
  (bookingBookable, locations) => locations.find((value, key) => key === bookingBookable.get('location')) || Map()
)

export const getBookingBookableName = createGetSelector(getBookingBookableEntity, 'name', null)
export const getBookingLocationName = createGetSelector(getBookingBookableLocationEntity, 'name', null)

// Private helper for selecting bookings for a given date (ie. GroupedBookingsList)
const getDateForBookings = (state, props) => props.date

export const getBookingsForDate = createSelector(
  [ getDateForBookings, getBookingIds, getBookingEntities ],
  (date, bookingIds, bookings) => {
    return bookingIds.filter(id => isSameDay(bookings.getIn([id, 'start']), date)).sort((a, b) => {
      return compareDates(bookings.getIn([a, 'start']), bookings.getIn([b, 'start']))
    })
  }
)

// ### Locations -------------------------------------------------------------

export const getLocationEntity = (state, props) => getLocationEntities(state).get(props.id, null)

export const getLocationName = createGetSelector(getLocationEntity, 'name', null)
export const getLocationTimezone = createGetSelector(getLocationEntity, 'timeZone', null)

const getNameForLocation = (state, props) => props.name

export const getLocationByName = createSelector(
  [ getNameForLocation, getLocationEntities ],
  (name, locations) => locations.find(value => value.get('name') === name)
)

export const getLocationOptions = createSelector(
  [ getLocationIds, getLocationEntities ],
  (ids, locations) => ids.map(id => ({ id, name: locations.getIn([id, 'name']) }))
)

const getBookingFormLocation = state => formValueSelector('booking')(state, 'locationId')

export const getBookingFormLocationName = createSelector(
  [ getBookingFormLocation, getLocationEntities ],
  (locationId, locations) => locations.getIn([locationId, 'name'], 'North Pole')
)

// ### Users -----------------------------------------------------------------

export const getBookingsForUserForDate = createSelector(
  [ getUserId, getBookingsForDate, getBookingEntities ],
  (userId, bookingIds, bookings) => bookingIds.filter(id => bookings.getIn([id, 'user']) === userId)
)

// ### Bookables -------------------------------------------------------------

export const getBookableEntity = (state, props) => getBookableEntities(state).get(props.id, null)

export const getBookableId = createGetSelector(getBookableEntity, 'id', null)
export const getBookableName = createGetSelector(getBookableEntity, 'name', null)
export const getBookableDisposition = createGetSelector(getBookableEntity, 'disposition', Map())
export const getBookableLocation = createGetSelector(getBookableEntity, 'location', null)

const getBookableBookings = createSelector(
  [ getBookableId, getBookingIds, getBookingEntities ],
  (bookableId, bookingIds, bookings) => bookingIds.filter(id => bookings.getIn([id, 'bookable']) === bookableId)
)

export const isBookableClosed = createSelector(
  [ getBookableDisposition ],
  disposition => disposition.get('closed')
)

export const getBookableDispositionReason = createSelector(
  [ getBookableDisposition ],
  disposition => disposition.get('reason')
)

const getBookingFormDates = state => formValueSelector('booking')(state, 'start', 'end', 'date')

const getBookingFormDateRange = createSelector(
  [ getBookingFormDates ],
  ({ start, end, date }) => ({
    end: formatDate(normalizeDateWithBase(end, date), 'YYYY-MM-DDTHH:mm:ss'),
    start: formatDate(normalizeDateWithBase(start, date), 'YYYY-MM-DDTHH:mm:ss'),
  })
)

const getBookableLocationEntity = createSelector(
  [ getBookableLocation, getLocationEntities ],
  (bookableLocation, locations) => locations.find((value, key) => key === bookableLocation)
)

export const getBookableLocationName = createGetSelector(getBookableLocationEntity, 'name', null)
export const getBookableLocationTimezone = createGetSelector(getBookableLocationEntity, 'timeZone', null)

export const getBookablesForLocation = createSelector(
  [
    getSelectedLocation,
    getBookableIds,
    getBookableEntities,
  ],
  (locationId, bookableIds, bookables) => bookableIds.filter(id => bookables.getIn([id, 'location']) === locationId).sort((a, b) => {
    return bookables.getIn([a, 'disposition', 'closed']) - bookables.getIn([b, 'disposition', 'closed'])
  })
)

// we can get state as a parameter
//  - just needed to pass an input-selector that simply
// returns state instead of Thing-On-State. Gah.
export const getBookingOverlaps = createSelector(
  [ getBookablesForLocation, getBookingEntities, getBookingFormDateRange, state => state ],
  (bookableIds, bookings, bookingFormDateRange, state) => {
    return Map(
      bookableIds.map((id) => {
        const bookableBookings = getBookableBookings(state, { id })
        const bookingRanges = bookableBookings.map(id => ({ end: bookings.getIn([id, 'end']), start: bookings.getIn([id, 'start']) }) )
        return [ id, doesRangeOverlap(bookingFormDateRange, bookingRanges) ]
      })
    )
  }
)

export const getBookablesSortedByAvailability = createSelector(
  [ getBookablesForLocation, getBookableEntities, getBookingOverlaps ],
  (bookableIds, bookables, bookingOverlaps) => bookableIds.sort((a, b) => {
    const isAvailableA = !bookables.getIn([a, 'disposition', 'closed']) && !bookingOverlaps.get(a)
    const isAvailableB = !bookables.getIn([b, 'disposition', 'closed']) && !bookingOverlaps.get(b)
    // No, really! subtracting a boolean from a boolean will return -1, 0 or 1!
    // B - A === available bookables are first, A - B === unavailable bookables are first
    return isAvailableB - isAvailableA
  })
)
