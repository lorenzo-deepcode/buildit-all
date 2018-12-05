import React, { Component } from 'react';

class QuantityPicker extends Component {
  render() {
    const styles = this.props.styles || {};
    return(
      <div className={styles['quantity-picker'] || 'quantity-picker'}>
        <span className={styles['minus'] || 'minus'}>-</span>
        <span className={styles['quantity'] || 'quantity'}>{this.props.quantity}</span>
        <span className={styles['plus'] || 'plus'}>+</span>
      </div>
    )
  }
};

export default QuantityPicker;
