import React, { Component } from 'react';

const MenuCategoryItem = ({ name, reverseType = false }) => (
    <div className={`menu-category-item ${reverseType ? 'reverse-type' : ''}`}>
      <h2 className="category-name">{name}</h2>
    </div>
);

export default MenuCategoryItem;
