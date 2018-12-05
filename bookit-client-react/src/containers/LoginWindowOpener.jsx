import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { createPropsSelector } from 'reselect-immutable-helpers'

import WindowOpener from 'Components/WindowOpener'

import { authenticationRedirectUrl, signinRequestUrl } from 'Utils'

import { actionCreators, selectors } from 'Redux'

export class LoginWindowOpener extends Component {
  constructor(props) {
    super(props)

    this.toggleLoginInProgress = this.toggleLoginInProgress.bind(this)

    this.startLoginWindowPolling = this.startLoginWindowPolling.bind(this)
    this.closeLoginWindow = this.closeLoginWindow.bind(this)

    this.pollLoginWindowLocation = this.pollLoginWindowLocation.bind(this)

    this.state = {
      loginInProgress: false,
      loginWindow: null,
      poller: null,
    }
  }

  static propTypes = {
    children: PropTypes.node,
    userEmail: PropTypes.string,
    authRequest: PropTypes.func,
  }

  startLoginWindowPolling(loginWindow) {
    this.setState({ loginWindow, poller: setInterval(this.pollLoginWindowLocation, 1) })
  }

  closeLoginWindow() {
    const { poller } = this.state
    poller && clearInterval(poller)
    this.setState({ loginWindow: null, poller: null, loginInProgress: false })
  }

  pollLoginWindowLocation() {
    const { loginWindow } = this.state
    const { authRequest } = this.props

    if (!loginWindow || loginWindow.closed || loginWindow.closed === undefined) this.closeLoginWindow()

    try {
      if (loginWindow.location.href.indexOf(authenticationRedirectUrl()) != -1) {
        authRequest(loginWindow.location.hash)
        this.closeLoginWindow()
      }
    } catch (error) {} // eslint-disable-line no-empty
  }

  toggleLoginInProgress() {
    const { loginInProgress } = this.state
    this.setState({ loginInProgress: !loginInProgress })
  }

  render() {
    const { loginInProgress } = this.state

    return (
      <div>
        { React.cloneElement(
          this.props.children,
          {
            onClick: this.toggleLoginInProgress,
            disabled: Boolean(this.state.loginWindow),
          }
        )}
        { loginInProgress &&
          <WindowOpener
            url={signinRequestUrl('login', this.props.userEmail)}
            onLoaded={this.startLoginWindowPolling}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = createPropsSelector({
  userEmail: selectors.getUserEmail,
})

export default connect(mapStateToProps, { authRequest: actionCreators.authRequest })(LoginWindowOpener)
