import React, { Component } from 'react';
import QuantityPicker from './QuantityPicker';
import { connect } from 'react-redux';

const MenuItem = ({ name, price, coins, imageUrl, onAddClick, onRemoveClick, quantity = 0 }) => (
    <div className="menu-item">
      <img src={imageUrl} className="menu-image"/>
      <div className="info">
          <span className="name">{name}</span>
          <span className="price">{price}</span>
      </div>
      <div className="coins">
        <span>
          <img src="../assets/images/taco-coin.png" />
          {coins}
        </span>
      </div>
      <QuantityPicker
        onAddClick={onAddClick}
        onRemoveClick={onRemoveClick}
        quantity={quantity}
        />
    </div>
);

export default MenuItem;
