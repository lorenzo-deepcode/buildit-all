import React from 'react'
import ButtonLargePink from 'taco-components/components/1-Atoms/ButtonLargePink';

const viewButtonPink = {
    name: "Button Large Pink",
    component: (
      <ButtonLargePink
        ButtonText="New Order"
        ButtonLink="/"
      />
    ),
    type: "button",
    description: "A large pink button used mostly for the landing page",
    reactComponent: "ButtonLargePink",
    reactComponentLibrary: "TacoComponents",
    context: {
      children: [],
      parents: []
    },
    style: {},
    approved: false,
  }

export default viewButtonPink
