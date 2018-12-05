import React from 'react'
import PropTypes from 'prop-types'

import { formatDate, isToday } from 'Utils'

import styles from 'Styles/grouped-bookings.scss'

export class GroupedBookingsList extends React.Component {
  render() {
    const { date, bookingIds, component: Component } = this.props
    return (
      <div className={styles.groupedBookingList}>
        <div className={`${styles.heading} ${ isToday(date) ? styles.headingGreen : ''}`}>
          <h4 className={styles.title}>
            { isToday(date) && 'TODAY - ' }
            { formatDate(date, 'ddd MMM D').toUpperCase() }
          </h4>
        </div>
        { bookingIds.map(id => <Component key={id} id={id} />) }
        { !bookingIds.length && <p className={styles.noBooking}>No bookings to show</p> }
      </div>
    )
  }
}

GroupedBookingsList.propTypes = {
  date: PropTypes.string,
  bookingIds: PropTypes.array,
  component: PropTypes.oneOfType([ PropTypes.node, PropTypes.func ]),
}

export default GroupedBookingsList
