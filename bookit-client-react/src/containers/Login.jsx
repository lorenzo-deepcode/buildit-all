import React from 'react'

import Button from 'Components/Button'

import LoginWindowOpener from 'Containers/LoginWindowOpener'

import styles from 'Styles/login.scss'

export const Login = () => (
  <div className={styles.login}>
    <div className={styles.top}>
      <h1>Bookit</h1>
    </div>
    <div className={styles.bottom}>
      <LoginWindowOpener>
        <Button className={styles.bigButton} id="login">Sign in with Microsoft Credentials</Button>
      </LoginWindowOpener>
    </div>
  </div>
)

export default Login
