import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { createPropsSelector } from 'reselect-immutable-helpers'

import { selectors } from 'Redux'

export default (WrappedComponent) => {
  const mapStateToProps = createPropsSelector({
    closed: selectors.isBookableClosed,
    reason: selectors.getBookableDispositionReason,
    name: selectors.getBookableName,
  })

  // Object.assign({}, ownProps, stateProps, dispatchProps)
  const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
  })

  const withBookable = connect(mapStateToProps, {}, mergeProps)(WrappedComponent)

  withBookable.propTypes = {
    id: PropTypes.string.isRequired,
  }

  return withBookable
}
