import React, { Component } from 'react';
import PlaceholderImage from '../1-Atoms/PlaceholderImage';
import QuantityPicker from '../1-Atoms/QuantityPicker';

const MenuItem = ({ name, price, imageUrl, coins, quantity = 0, styles = {} }) => (
    <div className={styles['menu-item'] || 'menu-item'}>
      <img src={imageUrl} className="menu-image"/>
      <div className={styles['info'] || 'info'}>
          <span className={styles['name'] || 'name'}>{name}</span>
          <span className={styles['price'] || 'price'}>{price}</span>
      </div>
      <div className="coins">
        <span>
          <img src="../assets/images/taco-coin.png" />
          {coins}
        </span>
      </div>
      <QuantityPicker quantity={6} styles={styles} />
    </div>
);

export default MenuItem;
