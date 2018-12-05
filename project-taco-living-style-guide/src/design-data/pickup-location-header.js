import React from 'react'
import PickUpLocationHeader from 'taco-components/components/1-Atoms/PickUpLocationHeader';

const viewLocationHeader = {
    name: "PickUp Location Header",
    component: (
      <PickUpLocationHeader
          locationHeader="pick up location"
          timeHeader="pick up time"
        />
    ),
    type: "location",
    description: "A header for location and pick up info",
    reactComponent: "PickupLocationHeader",
    reactComponentLibrary: "TacoComponents",
    context: {
      children: [],
      parents: []
    },
    style: {},
    approved: false,
  }

export default viewLocationHeader
