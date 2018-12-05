import React from 'react'

import { Link } from 'react-router-dom'

import BaseBookingItem from 'Components/BaseBookingItem'

import styles from 'Styles/booking-item.scss'

import withBooking from 'Hoc/with-booking'

export const BookingListItem = ({ id, ...props }) => (
  <Link to={`/bookings/${id}`} className={ styles.bookingItemLink }><BaseBookingItem id={id} {...props} /></Link>
)

BookingListItem.propTypes = {
  id: BaseBookingItem.propTypes.id,
}

export default withBooking(BookingListItem)
