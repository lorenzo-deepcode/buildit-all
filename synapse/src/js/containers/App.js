import React, {
  PropTypes,
} from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from 'actions';
import MessageBar from 'components/2-molecules/MessageBar';
import Login from 'components/2-molecules/Login';
import Header from 'components/2-molecules/Header';
import Footer from 'whippersnapper/build/Footer';
require('zzzss/dist/css/zzzss.css');

const version = process.env.VERSION;

const App = ({
  message,
  resetProject,
  dismissMessage,
  projectName,
  children,
  status,
  statuses,
  loginRequest,
  logoutRequest,
  isAuthenticated,
  user,
  authMessage,
  location,
 }) => (
  <div className="container">
    <Login
      onLoginClick={loginRequest}
      onLogoutClick={logoutRequest}
      isAuthenticated={isAuthenticated}
      userName={user ? user.name : ''}
      message={authMessage}
    />
    <Header
      projectName={projectName}
      onLogoClick={() => {
        // Navigate to home screen. Should this be first or last?
        browserHistory.push('/');

        // reset the project in the state tree
        resetProject();

        // reset the message.
        dismissMessage();
      }}
      status={status}
      statuses={statuses}
      location={location}
    />
    <MessageBar message={message} />
    {children}
    <Footer
      appVersion={version}
    />
  </div>
);

App.propTypes = {
  message: PropTypes.object.isRequired,
  resetProject: PropTypes.func.isRequired,
  dismissMessage: PropTypes.func.isRequired,
  projectName: PropTypes.string,
  status: PropTypes.string,
  statuses: PropTypes.array,
  updateProject: PropTypes.func.isRequired,
  children: PropTypes.object.isRequired,
  loginRequest: PropTypes.func.isRequired,
  logoutRequest: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object,
  authMessage: PropTypes.string,
  location: PropTypes.object,
};

function mapStateToProps(state) {
  const projectName = state.project ? state.project.name : '';
  return {
    message: state.messages,
    appData: state.appData,
    projectName,
    status: state.project.status,
    statuses: state.statuses.statuses,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    authMessage: state.auth.message,
  };
}

export default connect(mapStateToProps, actionCreators)(App);
