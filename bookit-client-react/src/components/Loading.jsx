import React from 'react'

import styles from 'Styles/loading.scss'

const Loading = () => (
  <div className={styles.loading}>
    <div className={styles.loadingPulse}></div>
  </div>
)

export default Loading
