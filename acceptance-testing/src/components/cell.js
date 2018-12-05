import React from 'react';
import Radium from 'radium';

// eslint-disable-next-line
export default Radium(({ children, width, align, style }) => {

  const styles = {
    base: {
      width: (width || 20) + '%'
    , float: 'left'
    , textAlign: align || 'left'
    }
  };

  return (
    <span className='cell' style={[ styles.base, style ]}>
      {children}
    </span>
  );
});
