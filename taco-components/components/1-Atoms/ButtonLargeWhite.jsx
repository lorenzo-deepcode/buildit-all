import React, { Component } from 'react';
import { Link } from 'react-router';

class ButtonLargeWhite extends Component {
  render() {
    return(
      <div className="button">
        <Link to={`${this.props.ButtonLink}`}>{this.props.ButtonText}</Link>
      </div>
    )
  }
};

export default ButtonLargeWhite;
