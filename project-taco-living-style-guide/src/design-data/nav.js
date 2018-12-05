import React from 'react'
import Nav from 'taco-components/components/2-Molecules/Nav';

const menuItemData = {
    name: "Nav",
    component: (
      <Nav />
    ),
    type: "navigation",
    description: "Navigation bar.",
    reactComponent: "Nav",
    reactComponentLibrary: "TacoComponents",
    context: {
      children: ["one", "two", "three"],
      parents: ["one", "two"]
    },
    style: {},
    approved: false,
  }

export default menuItemData
