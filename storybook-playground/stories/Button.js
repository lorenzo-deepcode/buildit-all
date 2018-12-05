/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import PropTypes from 'prop-types';
import React from 'react';
import './styles.css';

const Button = ({ children, onClick }) =>
  <button className="my-button-styles " onClick={onClick}>
    {children}
  </button>;

Button.propTypes = {
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
Button.defaultProps = {
  onClick: () => {},
};

export default Button;
