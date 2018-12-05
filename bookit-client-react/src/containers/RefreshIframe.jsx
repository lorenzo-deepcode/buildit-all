import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { createPropsSelector } from 'reselect-immutable-helpers'

import { authenticationRedirectUrl, refreshRequestUrl } from 'Utils'

import { actionCreators, selectors } from 'Redux'

import Iframe from 'Components/Iframe'

export class RefreshIframe extends Component {
  static propTypes = {
    isRefreshingAuthentication: PropTypes.bool,
    refreshAuthSuccess: PropTypes.func,
    userEmail: PropTypes.string,
  }

  constructor(props) {
    super(props)

    this.pollForLocation = this.pollForLocation.bind(this)
    this.poller = null
  }

  pollForLocation() {
    const { iframeRef: iframe, props: { refreshAuthSuccess } } = this

    if (!iframe) {
      this.cancelPolling()
    } else {
      try {
        const iwindow = iframe.contentWindow
        if (iwindow.location.href.indexOf(authenticationRedirectUrl()) != -1) {
          this.cancelPolling()
          refreshAuthSuccess(iwindow.location.hash)
        }
      } catch (error) {}  // eslint-disable-line
    }

  }

  cancelPolling() {
    this.poller && clearInterval(this.pollForLocation)
    this.poller = null
  }

  componentDidUpdate()  {
    if (this.props.isRefreshingAuthentication) {
      this.cancelPolling()
      this.poller = setInterval(this.pollForLocation, 1)
    }
  }

  componentWillUnmount() {
    this.cancelPolling()
  }

  render() {
    return (
      this.props.isRefreshingAuthentication &&
      <Iframe
        src={refreshRequestUrl(this.props.userEmail)}
        iframeRef={el => this.iframeRef = el}
      />
    )
  }
}

const mapStateToProps = createPropsSelector({
  isRefreshingAuthentication: selectors.isRefreshingAuthentication,
  userEmail: selectors.getUserEmail,
})

const enhance = connect(mapStateToProps, { refreshAuthSuccess: actionCreators.refreshAuthSuccess })

export default enhance(RefreshIframe)
