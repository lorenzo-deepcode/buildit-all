import React, { Component } from 'react';

class PickUpLocationHeader extends Component {
  render() {
    return(
      <div className="pick-up">
        <div className="pick-up-location-small">
          {this.props.locationHeader}
        </div>
        <div className="pick-up-time">
          {this.props.timeHeader}
        </div>
      </div>
    )
  }
};

export default PickUpLocationHeader;
