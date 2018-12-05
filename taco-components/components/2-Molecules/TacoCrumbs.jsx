import React from 'react';

const TacoCrumbs = ({ viewName }) => (
  <div className="header">
    <div className="back-button">
      <img src="../assets/images/back-button.png" />
    </div>
    <div className="header-text">{ viewName }</div>
    <div className="cart-button">
      <img src="../assets/images/cart-icon.png" />
    </div>
</div>
)

export default TacoCrumbs;
