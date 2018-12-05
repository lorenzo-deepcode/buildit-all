import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { change } from 'redux-form'

import { selectors, actionCreators } from 'Redux'

import ActionLink from 'Components/ActionLink'
import BookableAvailabilityItem from 'Components/BookableAvailabilityItem'

import styles from 'Styles/list.scss'

import backArrow from 'Images/backArrow.svg'

export class BookablesList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      availability: [],
      selectedLocationName: '',
    }
  }

  async componentDidMount() {
    const { getAvailability, dates: { start, end }, location} = this.props
    const { payload: availability } = await getAvailability(start, end, location)
    this.setState({ availability })
  }

  handleBack = () => {
    this.props.setBookablesVisible(false)
  }

  handleBookableClick = (bookableId) => {
    this.props.change('booking', 'bookableId', bookableId)
    this.handleBack()
  }

  render() {
    const { availability } = this.state
    const { locationName } = this.props

    return (
      <div className={styles.bookablesList}>
        <div className={styles.bookablesHeader}>
          <ActionLink onClick={this.handleBack} className={styles.back}>
            <img src={backArrow} alt="Go Back" />
          </ActionLink>
          <h3 className={styles.heading}>Select a Room ({locationName})</h3>
        </div>
        <div className={styles.bookablecontainer}>
          { availability.map(bookable => (
            <BookableAvailabilityItem
              key={bookable.bookableId}
              className={styles.bookable}
              onClick={this.handleBookableClick}
              {...bookable}
            />)
          )}
        </div>
      </div>
    )
  }
}

BookablesList.propTypes = {
  dates: PropTypes.object,
  change: PropTypes.func,
  getAvailability: PropTypes.func,
  setBookablesVisible: PropTypes.func,
  location: PropTypes.string,
  locationName: PropTypes.string,
}

const mapStateToProps = state => ({
  dates: selectors.getBookingFormDateRange(state),
  location: selectors.getBookingFormLocation(state),
  locationName: selectors.getBookingFormLocationName(state),
})

const mapDispatchToProps = {
  getAvailability: actionCreators.getAvailability,
  change,
}

export default connect(mapStateToProps, mapDispatchToProps)(BookablesList)
