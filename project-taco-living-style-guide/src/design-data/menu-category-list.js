import React from 'react'
import MenuCategoryList from 'taco-components/components/3-Organisms/MenuCategoryList';

const menuCategoryListData = {
    name: "Menu Category List",
    component: (
      <MenuCategoryList />
    ),
    type: "menu",
    description: "Displays a list of food categories.",
    reactComponent: "MenuCategoryList",
    reactComponentLibrary: "TacoComponents",
    context: {
      children: ["MenuCategoryItem"],
      parents: []
    },
    style: {},
    approved: false,
  }

export default menuCategoryListData
