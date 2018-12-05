import React from 'react';
import Radium from 'radium';
import moment from 'moment';
import Cell from './cell';

// eslint-disable-next-line
export default Radium(({ date, day }) => {
  const styles = {
    date: {
      display: 'inline-block'
    , paddingLeft: 5
    , fontSize: '0.9em'
    , fontWeight: 300
    , color: '#999'
    , '@media (max-width: 639px)': {
        display: 'block'
      , paddingLeft: 0
      }
    }
  };

  return (
    <Cell align='left' width={15}>
      <span className='name' data-test={`day-${day}`}>
        {moment(date).format('ddd')}
      </span>
      <span className='date' style={styles.date} data-test={`date-${day}`}>
        {moment(date).format('D')}
      </span>
    </Cell>
  );
});