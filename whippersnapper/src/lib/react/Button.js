import React from 'react';

const Button = ({ label, cssClasses, onClick, disabled = false, id = undefined }) => (
  <button
    className={`button ${cssClasses}`}
    onClick={onClick}
    disabled={disabled}
    id={id}
  >{label}
  </button>
);

export default Button;

Button.propTypes = {
  label: React.PropTypes.string.isRequired,
  id: React.PropTypes.string,
  cssClasses: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool,
};
