import React from 'react';

const TableHeaderCell = ({ headerValue, id, classes }) => (
  <th className={`tableHeaderCell ${classes}`} id={id}>{headerValue}</th>
);

export default TableHeaderCell;

TableHeaderCell.propTypes = {
  headerValue: React.PropTypes.string.isRequired,
  id: React.PropTypes.string,
  classes: React.PropTypes.string,
};
