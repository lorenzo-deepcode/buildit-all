import React from 'react'

import { Route } from 'react-router'

import TransitionSwitch from 'Components/TransitionSwitch'

import Loading from 'Components/Loading'
import BookingFormContainer from 'Containers/BookingFormContainer'
import Landing from 'Containers/Landing'
import BookingsList from 'Containers/BookingsList'
import Login from 'Containers/Login'
import EditBooking from 'Containers/EditBooking'

const ApplicationRoutes = () => (
  <TransitionSwitch>
    <Route exact path="/" render={Loading} />
    <Route exact path="/home" component={Landing} />
    <Route path="/login" component={Login} />
    <Route path="/book" component={BookingFormContainer} />
    <Route path="/bookings/:id" component={EditBooking} />
    <Route path="/bookings" component={BookingsList} />
  </TransitionSwitch>
)

export default ApplicationRoutes
