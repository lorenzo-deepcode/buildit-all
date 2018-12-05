import React from 'react'
import PropTypes from 'prop-types'

import { formatTime } from 'Utils'

import styles from 'Styles/booking-item.scss'

export const BaseBookingItem = ({ id, subject, start, end, bookableName, locationName }) => {
  return (
    <div className={styles.bookingItem} id={ `booking-${id}` }>
      <p>{ formatTime(start) } - { formatTime(end) }</p>
      <p id={`booking-${subject.replace(/\s/g, '-').toLowerCase()}`}>{ subject }</p>
      <h3>{ bookableName } ({ locationName })</h3>
    </div>
  )
}

BaseBookingItem.propTypes = {
  id: PropTypes.string,
  subject: PropTypes.string,
  start: PropTypes.string,
  end: PropTypes.string,
  bookableName: PropTypes.string,
  locationName: PropTypes.string,
}

export default BaseBookingItem
