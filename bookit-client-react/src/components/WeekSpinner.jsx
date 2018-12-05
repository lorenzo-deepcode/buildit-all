import React from 'react'

import PropTypes from 'prop-types'

import ActionLink from 'Components/ActionLink'

import { getPreviousAndNextWeekDates, formatWeek } from 'Utils'

import styles from 'Styles/week-spinner.scss'

const WeekSpinner = ({ weekOf, onClick }) => {
  const [ previousWeek, nextWeek ] = getPreviousAndNextWeekDates(weekOf)

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <ActionLink onClick={() => onClick(previousWeek)} id="previous">&#12296;</ActionLink>
      </div>
      <div className={styles.week}>
        <h3>{formatWeek(weekOf)}</h3>
      </div>
      <div className={styles.controls}>
        <ActionLink onClick={() => onClick(nextWeek)} id="next">&#12297;</ActionLink>
      </div>
    </div>
  )
}

WeekSpinner.propTypes = {
  weekOf: PropTypes.string,
  onClick: PropTypes.func,
}

export default WeekSpinner
