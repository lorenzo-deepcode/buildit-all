import React from 'react';
import { Hour, Description, Temperature, Wind, Atmosphere } from './';

export default ({ forecast, day, detail }) => {

  const styles = {
    base: {
      paddingTop: 5
    , clear: 'both'
    }
  };

  return (
    <div className='detail' style={styles.base}>
      <Hour date={forecast.date} width={15} day={day} detail={detail} />
      <Description description={forecast.description} width={15} size={24} day={day} detail={detail} />
      <Temperature maximum={forecast.maximumTemperature} minimum={forecast.minimumTemperature} day={day} detail={detail} />
      <Wind speed={forecast.windSpeed} direction={forecast.windDirection} day={day} detail={detail} />
      <Atmosphere rainfall={forecast.rainfall} pressure={forecast.pressure} width={30} day={day} detail={detail} />
    </div>
  );
};