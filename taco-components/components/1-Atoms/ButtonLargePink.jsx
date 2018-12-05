import React, { Component } from 'react';
import { Link } from 'react-router';

class ButtonLargePink extends Component {
  render() {
    return(
      <div className="button-pink">
        <Link to={`${this.props.ButtonLink}`}>{this.props.ButtonText}</Link>
      </div>
    )
  }
};

export default ButtonLargePink;
