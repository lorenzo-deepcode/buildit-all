import React from 'react'
import PlaceholderImage from 'taco-components/components/1-Atoms/PlaceholderImage';

const placeholderImageData = {
    name: "PlaceholderImage",
    component: (
      <PlaceholderImage
        width={230}
        height={150}
        label="Taco and drink"
      />
    ),
    type: "development",
    description: "Displays a placeholder image of given size with an optional label. Of course, this is to be used for development only.",
    reactComponent: "PlaceholderImage",
    reactComponentLibrary: "TacoComponents",
    context: {
      children: [],
      parents: []
    },
    style: {},
    approved: false,
  }

export default placeholderImageData
