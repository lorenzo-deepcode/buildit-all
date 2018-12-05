import React from 'react';
import moment from 'moment';
import Cell from './cell';

export default ({ date, day, detail }) => {

  return (
    <Cell align='left' width={15}>
      <span className='hour' data-test={`hour-${day}-${detail}`}>{moment(date).format('HHmm')}</span>
    </Cell>
  );
};