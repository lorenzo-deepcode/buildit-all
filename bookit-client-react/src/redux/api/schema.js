import { normalize, schema } from 'normalizr'

import { createIntervalTree, formatDate, endOfDay } from 'Utils'

export const locationSchema = new schema.Entity('locations', {})

export const bookableSchema = new schema.Entity('bookables', {}, {
  processStrategy: ({ id, name, location, disposition }) => ({
    id,
    name,
    location,
    disposition,
  }),
})

export const bookingSchema = new schema.Entity('bookings', {}, {
  processStrategy: ({ id, subject, start, end, bookable, user }) => ({
    id,
    subject,
    start,
    end,
    bookable,
    user,
  }),
})

export const userSchema = new schema.Entity('users', {}, {
  idAttribute: 'externalId',
  processStrategy: ({ id, externalId, name }) => ({ id, externalId, name }),
})

export const availabilitySchema = new schema.Entity('availability', {}, {
  processStrategy: ({ id, name, disposition: { closed, reason }, bookings }) => {
    const tree = createIntervalTree(
      bookings.map(({ start, end, user: { name } }) => [ start, end, { name, start, end } ])
    )
    return { id, name, closed, reason, bookings: tree }
  },
})

bookableSchema.define({ location: locationSchema })
bookingSchema.define({ bookable: bookableSchema, user: userSchema })

export const normalizeLocations = (data) => {
  const { entities: { locations }, result } = normalize(data, [ locationSchema ])
  return { entities: { locations: (locations || {}) }, result: { locations: result } }
}

export const normalizeBookables = (data) => {
  const { entities: { bookables }, result } = normalize(data, [ bookableSchema ])
  return { entities: { bookables: (bookables || {}) }, result: { bookables: result } }
}

export const normalizeBookings = (data) => {
  const { entities: { bookings, users }, result } = normalize(data, [ bookingSchema ])
  return {
    entities: { bookings: (bookings || {}), users: (users || {}) },
    result: { bookings: result, users: (users ? Object.keys(users) : []) },
  }
}

export const normalizeBooking = (data) => {
  const { entities: { bookings, users }, result } = normalize(data, bookingSchema)
  return {
    entities: { bookings: (bookings || {}), users: (users || {}) },
    result: { bookings: [ result ], users: (users ? Object.keys(users) : []) },
  }
}

export const normalizeAvailability = (data, start, end) => {
  const { entities: { availability } } = normalize(data, [ availabilitySchema ])
  return Object.values(availability).map(({ id, name, closed, reason, bookings }) => {
    if (!closed) {
      const overlaps = bookings.search(start, end)
      closed = Boolean(overlaps.length)
      reason = closed ? `Booked by ${overlaps[0].name} until ${formatDate(overlaps[0].end, 'HH:mm')}` : reason
    }

    let freeUntil = null
    const futureOverlap = bookings.search(end, formatDate(endOfDay(end), 'YYYY-MM-DDTHH:mm:ss'))
    if(futureOverlap && futureOverlap.length > 0){
      freeUntil = futureOverlap[0].start
    }
    
    return { bookableId: id, name, closed, reason, freeUntil }
  }).sort((a, b) => a.closed - b.closed)
}
