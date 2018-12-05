import React from 'react';
import moment from 'moment';

const EventHistoryItemHeader = ({ label, date, status = '--' }) => (
  <div className="event-history-item-header">
    <span className="event-body-item-label">{label}:</span>
    <span className="status">{status}</span>
    <span> at </span>
    <span>{date ? moment(date).format('MMM DD, YYYY HH:mm') : ''}</span>
  </div>);

export default EventHistoryItemHeader;

EventHistoryItemHeader.propTypes = {
  label: React.PropTypes.string.isRequired,
  date: React.PropTypes.string.isRequired,
  status: React.PropTypes.string.isRequired,
};
