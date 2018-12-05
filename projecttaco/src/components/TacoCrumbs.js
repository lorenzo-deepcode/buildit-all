import React from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

const TacoCrumbs = ({ viewName,  cartCount }) => (
  <div className="header">
    <div className="back-button" className="back-button" onClick={browserHistory.goBack}>
      <img src="../assets/images/back-button.png" />
    </div>
    <div className="header-text">
      { viewName }
    </div>
    <div className="cart-button">
      <Link to="/cart"><img src="../assets/images/cart-icon.png" /></Link>
      <span className="cartNumber">{ cartCount }</span>
    </div>
  </div>
)

export default TacoCrumbs;
