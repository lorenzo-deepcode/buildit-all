import React, { Component } from 'react';

class SubTotalBlock extends Component {
  render() {
    return(
      <div className="total">
        <span className="subtotal">
          {this.props.subtotal}
        </span>
        <span className="amount">
          {this.props.amount}
        </span>
      </div>
    )
  }
};

export default SubTotalBlock;
