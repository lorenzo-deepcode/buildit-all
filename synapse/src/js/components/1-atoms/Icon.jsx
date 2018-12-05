import React from 'react';

const Icon = ({ icon, onClick }) => (
  <span
    onClick={onClick}
    className={`icon ${icon}`}
    aria-hidden="true"
  >
  </span>
);

export default Icon;

Icon.propTypes = {
  icon: React.PropTypes.string,
  onClick: React.PropTypes.func,
};
