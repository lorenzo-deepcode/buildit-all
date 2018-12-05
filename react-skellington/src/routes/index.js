import React from 'react'

import { Switch, Route } from 'react-router'

import ProtectedRoute from './ProtectedRoute'

// import App from '../containers/App'
import Login from '../containers/Login'
import Dashboard from '../containers/Dashboard'

import styles from '../containers/App/styles.scss'

const routes = () => (
  <div className={styles.app}>
    <Switch>
      {/*<Route exact path="/" component={App} />*/}
      <Route exact path="/login" component={Login} />
      <ProtectedRoute path="/" component={Dashboard} />
    </Switch>
  </div>
)

export default routes
