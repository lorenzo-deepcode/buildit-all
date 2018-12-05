import React, { Component } from 'react';

class OrderItem extends Component {
  render() {
    return(
      <div className="order-list-item">
        <span className="count">{this.props.count}</span>
        <span className="desc">{this.props.desc}</span>
        <span className="price">${this.props.price}</span>
      </div>
    )
  }
};

export default OrderItem;
