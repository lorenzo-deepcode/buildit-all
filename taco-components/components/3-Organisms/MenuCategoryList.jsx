import React, { Component } from 'react';
import MenuCategoryItem from '../2-Molecules/MenuCategoryItem';

// TODO: Provide via Redux store, via network request
const fakeCategories = [
  {
    name: "New",
    reverseType: true,
  },
  {
    name: "Breakfast",
    reverseType: true,
  },
  {
    name: "Tacos",
  },
  {
    name: "Burritos",
    reverseType: true,
  },
]

class MenuCategoryList extends Component {
  render() {
    return(
      <div className="menu-category-list">
        {fakeCategories.map((category, index) => (
          <MenuCategoryItem
            key={index}
            name={category.name}
            reverseType={category.reverseType}
            imageUrl={category.imageUrl}
          />
        ))}
      </div>
    )
  }
};

export default MenuCategoryList;
