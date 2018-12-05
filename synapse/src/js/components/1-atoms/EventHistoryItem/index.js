import React, { Component } from 'react';
import BodyItem from './BodyItem';
import EventHistoryItemHeader from './EventHistoryItemHeader';

class EventHistoryItem extends Component {
  constructor() {
    super();
    this.state = {
      isBodyVisible: false,
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    event.preventDefault();
    this.setState({
      isBodyVisible: !this.state.isBodyVisible,
    });
  }

  getClassName(status) {
    switch (status) {
    case 'FAILED': return 'event-history-item failed';
    case 'COMPLETED SUCCESSFULLY': return 'event-history-item success';
    default: return 'event-history-item';
    }
  }

  render() {
    const { eventItem } = this.props;
    return (
      <div
        className={this.getClassName(eventItem.status)}
        onClick={this.onClick}
      >
        <EventHistoryItemHeader
          label={eventItem.type}
          date={eventItem.startTime}
          status={eventItem.status}
        />
        <div className="event-body">
          <BodyItem
            label="Demand"
            date={eventItem.demand ? eventItem.demand.completion : ''}
            status={eventItem.demand ? eventItem.demand.status : undefined}
            visible={this.state.isBodyVisible}
          />
          <BodyItem
            label="Defect"
            date={eventItem.defect ? eventItem.defect.completion : ''}
            status={eventItem.defect ? eventItem.defect.status : undefined}
            visible={this.state.isBodyVisible}
          />
          <BodyItem
            label="Effort"
            date={eventItem.effort ? eventItem.effort.completion : ''}
            status={eventItem.effort ? eventItem.effort.status : undefined}
            visible={this.state.isBodyVisible}
          />
        </div>
      </div>
    );
  }
}

export default EventHistoryItem;

EventHistoryItem.propTypes = {
  eventItem: React.PropTypes.object.isRequired,
};
