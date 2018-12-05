import React from 'react'
import QuantityPicker from 'taco-components/components/1-Atoms/QuantityPicker';

const quantityPickerData = {
    name: "Quantity Picker",
    component: (
      <QuantityPicker
        quantity={1}
      />
    ),
    type: "menu",
    description: "Used in the MenuItem component to add items to an order.",
    reactComponent: "QuantityPicker",
    reactComponentLibrary: "TacoComponents",
    context: {
      children: [],
      parents: ["MenuItem"]
    },
    style: {},
    approved: false,
  }

export default quantityPickerData
