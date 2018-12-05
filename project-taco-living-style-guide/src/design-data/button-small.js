import React from 'react'
import ButtonSmall from 'taco-components/components/1-Atoms/ButtonSmall';

const viewButtonSmall = {
    name: "Button Small",
    component: (
      <ButtonSmall
        ButtonText="Order"
        ButtonLink="/"
      />
    ),
    type: "button",
    description: "A small action button used on most of the views",
    reactComponent: "ButtonSmall",
    reactComponentLibrary: "TacoComponents",
    context: {
      children: [],
      parents: []
    },
    style: {},
    approved: false,
  }

export default viewButtonSmall
