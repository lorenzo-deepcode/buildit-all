import React, { Component } from 'react';
import { Link } from 'react-router';

class ButtonSmall extends Component {
  render() {
    return(
      <div className="button-add">
        <Link to={`${this.props.ButtonLink}`}>{this.props.ButtonText}</Link>
      </div>
    )
  }
};

export default ButtonSmall;
