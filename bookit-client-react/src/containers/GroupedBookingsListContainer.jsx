import { connect } from 'react-redux'

import { selectors } from 'Redux'

import GroupedBookingsList from 'Components/GroupedBookingsList'
import BookingListItem from 'Components/BookingListItem'

const mapStateToProps = (state, props) => ({
  bookingIds: selectors.getBookingsForUserForDate(state, props),
  component: BookingListItem,
})

export default connect(mapStateToProps)(GroupedBookingsList)
