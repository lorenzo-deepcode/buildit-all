import React from 'react';

const TableCell = ({ cellValue, id, classes }) => (
  <td className={`tableCell ${classes}`} id={id}>{cellValue}</td>
);

export default TableCell;

TableCell.propTypes = {
  cellValue: React.PropTypes.string,
  id: React.PropTypes.string,
  classes: React.PropTypes.string,
};
