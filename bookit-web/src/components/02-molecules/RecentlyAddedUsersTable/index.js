import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import momentPropTypes from 'react-moment-proptypes'

import styles from './styles.scss'

const isUserRecent = (user) => {
  const oneWeekAgo = moment().subtract(1, 'week')
  return (
    user.dateAdded
    ? user.dateAdded.isAfter(oneWeekAgo)
    : false
  )
}

const RecentlyAddedUsersTable = ({ users = [] }) => (
  <div key="9" className={styles.recentlyAddedUsersTable}>
    <h2>Recently Added Users</h2>
    <table>
      <tbody>
      {users
        .filter(isUserRecent)
        .map(user => (
          <tr key={user.email}>
            <td>{user.email}</td>
            <td className={styles.team}>{user.team.toLowerCase()}</td>
          </tr>
        ))
      }
      </tbody>
    </table>
  </div>
)

export default RecentlyAddedUsersTable

RecentlyAddedUsersTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    email: PropTypes.string.isRequired,
    team: PropTypes.string.isRequired,
    dateAdded: momentPropTypes.momentObj,
  })
),
}
