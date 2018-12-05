import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Link } from 'react-router-dom'

import cn from 'classnames'

import { actionCreators, selectors } from 'Redux'

import backArrow from 'Images/backArrow.svg'

import styles from 'Styles/booking-card.scss'
import BookingCard from 'Components/BookingCard'
import withBooking from 'Hoc/with-booking'
import Button from 'Components/Button'

const EditBookingCard = withBooking(BookingCard)

export class EditBooking extends React.Component {
  render() {
    if (!this.props.hasBooking) {
      return <h1>Loading...</h1>
    }
    return (
      <div className={styles.booking}>
        <div className={styles.heading}>
          <Link to="/bookings" className={cn(styles.headingItem, styles.cancel)}>
            <img src={backArrow} alt="Go Back" />
          </Link>
          <h2 className={cn(styles.headingItem, styles.title)}>Manage Your Booking</h2>
        </div>
        <div className={styles.bookingCard}>
          <EditBookingCard id={this.props.match.params.id} />
        </div>
        <p>{this.props.isBookingInPast}</p>
        {!this.props.isBookingInPast && <Button className={styles.bigButton} onClick={() => this.props.deleteBooking(this.props.match.params.id)}>Cancel Booking</Button>}
      </div>
    )
  }
}

EditBooking.propTypes = {
  deleteBooking: PropTypes.func,
  match: PropTypes.object,
  hasBooking: PropTypes.bool,
  isBookingInPast: PropTypes.bool,
}

const mapStateToProps = (state, ownProps) => ({
  hasBooking: selectors.hasBooking(state, ownProps.match.params.id),
  isBookingInPast: selectors.isBookingInPast(state, { id: ownProps.match.params.id }),
})

export default connect(mapStateToProps, { deleteBooking: actionCreators.deleteBooking })(EditBooking)




