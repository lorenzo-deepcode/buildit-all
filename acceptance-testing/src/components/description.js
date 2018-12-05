import React from 'react';
import * as Icons from './icon';
import Cell from './cell';

export default ({ description, day, detail, size = 32 }) => {
  const Icon = Icons[description];

  const identifier = `description-${day}` + (detail != null ? `-${detail}` : '');

  return (
    <Cell width={15} align='center'>
      <Icon className='icon' label={description} size={size} data-test={identifier} />
    </Cell>
  );
};
