import React from 'react';
import Radium from 'radium';
import { Detail } from './';

// eslint-disable-next-line
export default Radium(({ details, day, active }) => {

  const styles = {
    base: {
      maxHeight: 0
    , clear: 'both'
    , overflow: 'hidden'
    , transition: 'all 0.5s ease-in-out'
    }
  , active: {
      maxHeight: 2000
    }
  };

  return (
    <div className='details' style={[ styles.base, active && styles.active ]}>
      {details.map((forecast, index) => <Detail key={forecast.key} forecast={forecast} day={day} detail={index+1} />)}
    </div>
  );
});