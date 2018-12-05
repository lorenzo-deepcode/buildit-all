import React from 'react'

const Button = ({ children, type = 'button', ...rest }) => (
    <button { ...rest } type={type}>{children}</button>
)

export default Button