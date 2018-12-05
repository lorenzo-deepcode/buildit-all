import React, { PropTypes } from 'react';
import EventHistoryItem from 'components/1-atoms/EventHistoryItem';

const EventHistory = ({ events = [] }) => {
  if (events.length > 0) {
    return (
      <div className="event-history">
        <h2>Project event history</h2>
          {events.map((eventItem, index) => (
            <EventHistoryItem
              key={`key-${index}`}
              eventItem={eventItem}
            />
          ))}
      </div>
    );
  }
  return <div className="event-history"></div>;
};

export default EventHistory;

EventHistory.propTypes = {
  events: PropTypes.array,
};
