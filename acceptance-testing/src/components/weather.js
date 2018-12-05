import React from 'react';
import { StyleRoot } from 'radium';
import { connect } from 'react-redux';
import { Forecast, City } from './';
import { fetch } from '../ducks/forecast';

export const Weather = ({ forecast, fetch }) => {
  const styles = {
    base: {
      width: '100%'
    , margin: '0 auto'
    , fontFamily: 'Lato'
    , fontWeight: 400
    }
  , message: {
      fontSize: '1.1em'
    }
  };

  return (
    <StyleRoot style={styles.base}>
      <h1 style={{fontWeight: 300}}>
        Five Day Weather Forecast for 
        <City initialValues={{ city: forecast.city }} onSubmit={data => fetch(data.city)} />
      </h1>

      {forecast.fetching && <div style={styles.message} data-test='loading'>Checking the skies...</div>}
      {!forecast.error && forecast.dates.map((date, index) => <Forecast key={date.date} date={date} day={index+1} />)}
      {forecast.error && <div style={styles.message} data-test='error'>Error retrieving the forecast</div>}
    </StyleRoot>
  );
};

export default connect(state => ({ forecast: state.forecast }), { fetch })(Weather);
