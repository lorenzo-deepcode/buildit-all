import React, { Component } from 'react';

class QuantityPicker extends Component {
  render() {
    return(
      <div className="quantity-picker">
        <span className="minus" onClick={() => {
            this.props.onRemoveClick ();
          }}>-</span>
        <span className="quantity">{this.props.quantity}</span>
        <span className="plus" onClick={() => {
            this.props.onAddClick ();
          }}>+</span>
      </div>
    )
  }
};

export default QuantityPicker;
