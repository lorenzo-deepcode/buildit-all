import React from 'react';

const Badge = ({ label }) => (
  <span className="badge">{label}</span>
);

export default Badge;

Badge.propTypes = {
  label: React.PropTypes.string.isRequired,
};
