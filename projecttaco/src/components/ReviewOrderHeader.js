import React, { Component } from 'react';

class ReviewHeaderOrder extends Component {
  render() {
    return(
      <div className="cart-header">
        <div className="triangle"></div>
        <div className="review-order">{this.props.review}</div>
        <div className="order-items">{this.props.count} items</div>
      </div>
    )
  }
};

export default ReviewHeaderOrder;
