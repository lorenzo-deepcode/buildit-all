import React from 'react';
import Radium from 'radium';
import { Day, Description, Temperature, Wind, Atmosphere } from './';

// eslint-disable-next-line
export default Radium(({ forecast, day, onClick }) => {

  const styles = {
    base: {
      fontSize: '1.5em'
    , clear: 'both'
    , ':hover': {
        cursor: 'pointer'
      }
    }
  };

  return (
    <div className='summary' onClick={onClick} style={[ styles.base ]}>
      <Day date={forecast.date} day={day} />
      <Description description={forecast.description} day={day} />
      <Temperature maximum={forecast.maximumTemperature} minimum={forecast.minimumTemperature} day={day} />
      <Wind speed={forecast.windSpeed} direction={forecast.windDirection} day={day} />
      <Atmosphere rainfall={forecast.rainfall} pressure={forecast.pressure} day={day} />
    </div>
  );
});