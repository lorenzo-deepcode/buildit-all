import React from 'react';
import moment from 'moment';

const BodyItem = ({ label, date, status = '--', visible = false }) => {
  if (visible) {
    return (
      <div className="body-item">
        <span className="event-body-item-label">{label}:</span>
        <span>{status}</span>
        <span>{date ? moment(date).format('MMM DD, YYYY HH:mm') : ''}</span>
      </div>);
  }
  return <div className="body-item"></div>;
};

export default BodyItem;

BodyItem.propTypes = {
  label: React.PropTypes.string.isRequired,
  date: React.PropTypes.string.isRequired,
  status: React.PropTypes.string.isRequired,
  visible: React.PropTypes.bool,
};
