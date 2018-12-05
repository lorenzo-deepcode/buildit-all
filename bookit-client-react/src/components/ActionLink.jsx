import React from 'react'
import PropTypes from 'prop-types'

export const ActionLink = ({ onClick, children, ...props }) => (
  <a
    { ...props }
    href="#"
    onClick={(event) => {
      event.preventDefault()
      onClick()
    }}
  >
    { children }
  </a>
)

ActionLink.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default ActionLink
