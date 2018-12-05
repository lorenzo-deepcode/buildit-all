import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const RouteLink = ({ route, label, classNames = '' }) => {
  const processedRoute = route.split('/').map(encodeURIComponent).join('/');

  return (
    <span className="route-link">
      <Link
        to={`${processedRoute}`}
        activeStyle={{
          textDecoration: 'none',
          color: 'gray',
        }}
        className={classNames}
      >
        {label}
      </Link>
    </span>
  );
};

RouteLink.propTypes = {
  route: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  classNames: PropTypes.string,
};

export default RouteLink;
