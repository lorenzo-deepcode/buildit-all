import React from 'react'
import PropTypes from 'prop-types'

const Button = ({ children, type = 'button', ...rest }) => (
  <button { ...rest } type={type}>{ children }</button>
)

Button.propTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf(['button', 'submit']),
}

export default Button
