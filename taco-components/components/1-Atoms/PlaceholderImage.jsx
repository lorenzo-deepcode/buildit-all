import React from 'react';

const PlaceholderImage = ({ width = 100, height = 100, label="" }) => {
  const placeholderImageStyle = {
    background: 'aqua',
    backgroundSize: 'cover',
    backgroundImage: `url(http://www.placehold.it/${width}x${height})`,
    width,
    height,
  }
  const labelStyle = {
    color: '#969696',
    padding: '1rem',
  }

  return (
    <div style={placeholderImageStyle}>
      <div style={labelStyle}>
        {label}
      </div>
    </div>
  )
}

export default PlaceholderImage;
