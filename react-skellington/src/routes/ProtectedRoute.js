import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Route, Redirect } from 'react-router'

import { isAuthorized } from '../lib/check-auth'

export const ProtectedRoute = ({ component: Component, user, dispatch, ...rest }) => (
  <Route {...rest} render={props => (
    isAuthorized(user, dispatch) ? (
      <Component {...props} />
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location },
      }} />
    )
  )} />
)

ProtectedRoute.propTypes = {
  component: PropTypes.func,
  dispatch: PropTypes.func,
  user: PropTypes.object,
  location: PropTypes.object,
}

const mapStateToProps = state => ({ user: state.user })

export default connect(mapStateToProps)(ProtectedRoute)
