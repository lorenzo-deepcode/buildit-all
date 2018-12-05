import React from 'react'
import PropTypes from 'prop-types'

import { Route, Switch } from 'react-router'

import { TransitionGroup } from 'react-transition-group'

import SlideOver from 'Components/SlideOver'

const TransitionSwitch = ({ transitionGroupClassName, children }) => (
  <Route render={({ location }) => (
    <TransitionGroup className={ transitionGroupClassName }>
      <SlideOver key={location.key}>
        <Switch key={location.key} location={location}>
          { children }
        </Switch>
      </SlideOver>
    </TransitionGroup>
  )}/>
)

TransitionSwitch.propTypes = {
  transitionGroupClassName: PropTypes.string,
}

TransitionSwitch.defaultProps = {
  transitionGroupClassName: 'app-container',
}

export default TransitionSwitch
