// import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { createPropsSelector } from 'reselect-immutable-helpers'

import { selectors } from 'Redux'

export default (WrappedComponent) => {
  const mapStateToProps = createPropsSelector({
    subject: selectors.getBookingSubject,
    start: selectors.getBookingStart,
    end: selectors.getBookingEnd,
    bookableName: selectors.getBookingBookableName,
    locationName: selectors.getBookingLocationName,
  })

  // Object.assign({}, ownProps, stateProps, dispatchProps)
  const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
  })

  const withBooking = connect(mapStateToProps, {}, mergeProps)(WrappedComponent)

  withBooking.propTypes = {
    id: PropTypes.string.isRequired,
  }

  return withBooking
}
