import React from 'react'
import ButtonLargeWhite from 'taco-components/components/1-Atoms/ButtonLargeWhite';

const viewButtonWhite = {
    name: "Button Large White",
    component: (
      <ButtonLargeWhite
        ButtonText="Order"
        ButtonLink="/"
      />
    ),
    type: "button",
    description: "A large white button used mostly for the landing page",
    reactComponent: "ButtonLargeWhite",
    reactComponentLibrary: "TacoComponents",
    context: {
      children: [],
      parents: []
    },
    style: {},
    approved: false,
  }

export default viewButtonWhite
