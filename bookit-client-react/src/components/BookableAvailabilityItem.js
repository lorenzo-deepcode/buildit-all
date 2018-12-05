import React from 'react'
import PropTypes from 'prop-types'
import { formatDate } from 'Utils'

const BookableAvailabilityItem = ({ bookableId, name, closed, reason, freeUntil, onClick, ...props }) => {
  let freeUntilText = "Free all day"
  if (!closed && freeUntil) {
    freeUntilText = `Free until ${formatDate(freeUntil, 'HH:mm')}`
  }

  return (
    <div onClick={() => !closed && onClick(bookableId)} {...props}>
      <h2>{name}</h2>
      {closed ? <p>{reason}</p> : <p>{freeUntilText}</p>}
    </div>
  )
}

BookableAvailabilityItem.propTypes = {
  bookableId: PropTypes.string,
  name: PropTypes.string,
  closed: PropTypes.bool,
  reason: PropTypes.string,
  freeUntil: PropTypes.string,
  onClick: PropTypes.func,
}

export default BookableAvailabilityItem
