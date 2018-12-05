import React from 'react'
import PropTypes from 'prop-types'

import { formatDate, formatTime } from 'Utils'

import styles from 'Styles/booking-card.scss'

export const BookingCard = ({ id, subject, start, end, bookableName }) => {
  return (
    <div className={styles.bookingItem} id={ `booking-${id}` }>
      <div className={styles.bookingInput}>
        <p>Day</p>
        <h3>{ formatDate(start, 'ddd, MMMM D, YYYY') }</h3>
      </div>
      <div className={styles.bookingInput}>
        <p>Time</p>
        <h3>{ formatTime(start) } - { formatTime(end) }</h3>
      </div>
      <div className={styles.bookingInput}>
        <p>Room</p>
        <h3>{ bookableName }</h3>
      </div>
      <div className={styles.bookingInput}>
        <p>Event name</p>
        <h3>{ subject }</h3>
      </div>
    </div>
  )
}

BookingCard.propTypes = {
  id: PropTypes.string,
  subject: PropTypes.string,
  start: PropTypes.string,
  end: PropTypes.string,
  bookableName: PropTypes.string,
}

export default BookingCard
