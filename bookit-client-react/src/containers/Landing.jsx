import React from 'react'

import { Link } from 'react-router-dom'

import Button from 'Components/Button'

import styles from 'Styles/landing.scss'

export const Landing = () => (
  <div className={styles.landing} id="landing">
    <div className={[styles.landingRow, styles.landingRowPadded].join(' ')}>
      <Link to="/book">
        <Button className={styles.bigButton1}>Book A Room</Button>
      </Link>
      <Link to="/bookings">
        <Button className={styles.bigButton2}>View Your Bookings</Button>
      </Link>
    </div>
  </div>
)

export default Landing
