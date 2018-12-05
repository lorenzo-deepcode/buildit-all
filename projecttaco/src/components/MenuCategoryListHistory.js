import React, { Component } from 'react';
import MenuCategoryItem from './MenuCategoryItem';

// TODO: Provide via Redux store, via network request
const fakeCategories = [
  {
    name: "Recent",
  },
  {
    name: "Favortites",
  },
]

class MenuCategoryListHistory extends Component {
  render() {
    return(
      <div className="menu-holder">
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
    </div>
    )
  }
};

export default MenuCategoryListHistory;
