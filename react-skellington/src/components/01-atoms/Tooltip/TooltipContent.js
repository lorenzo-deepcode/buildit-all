import React from 'react'
import PropTypes from 'prop-types'

const TooltipContent =
  ({ title, start, end, roomName, owner, isOwnedByUser, styles, onEditClick }) => (
    <div className={styles.content}>
      <p>
        <strong>{ title }</strong>
        { start.format('h:mma') } - { end.format('h:mma') }
      </p>
      <div className={styles.ownerInfo}>
        <p>
          <strong>{ roomName } Room</strong> by { isOwnedByUser ? 'me' : owner.name }
        </p>
        {isOwnedByUser ? <div onClick={() => onEditClick()} className={styles.edit}>Edit</div> : '' }
      </div>
    </div>
)

TooltipContent.propTypes = {
  title: PropTypes.string.isRequired,
  start: PropTypes.shape({}).isRequired,
  end: PropTypes.shape({}).isRequired,
  roomName: PropTypes.string.isRequired,
  owner: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  isOwnedByUser: PropTypes.bool.isRequired,
  styles: PropTypes.shape({}),
  onEditClick: PropTypes.func.isRequired,
}

export default TooltipContent
