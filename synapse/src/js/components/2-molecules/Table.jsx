import React from 'react';
import TableCell from 'components/1-atoms/TableCell';
import TableHeaderCell from 'components/1-atoms/TableHeaderCell';

const Table = ({ tableData, visibleColumns, rowKey, isStriped = false }) => {
  const headerRow = [];
  const bodyRows = [];
  let tableClasses = 'table';

  if (isStriped) {
    tableClasses = 'table table-striped';
  }

  for (const headerValue of visibleColumns) {
    headerRow.push(
      <TableHeaderCell
        key={headerValue}
        id={headerValue}
        headerValue={headerValue}
      />);
  }

  for (let i = 0; i < tableData.length; i++) {
    const bodyRow = [];
    for (const key of visibleColumns) {
      let cellValue = tableData[i][key];
      if (cellValue) {
        cellValue = cellValue.toString();
      }
      bodyRow.push(<TableCell key={i + key} id={i + key} cellValue={cellValue} />);
    }
    if (tableData[i][rowKey]) {
      const bodyRowKey = `row-${tableData[i][rowKey]}`;
      bodyRows.push(<tr
        key={bodyRowKey}
        id={bodyRowKey}
        className="tableBodyRow"
      >{bodyRow}</tr>);
    }
  }

  return (
    <table className={tableClasses}>
      <thead className="theadDark">
        <tr>
          {headerRow}
        </tr>
      </thead>
      <tbody>
        {bodyRows}
      </tbody>
    </table>
  );
};

export default Table;

Table.propTypes = {
  tableData: React.PropTypes.array.isRequired,
  visibleColumns: React.PropTypes.array.isRequired,
  rowKey: React.PropTypes.string.isRequired,
  isStriped: React.PropTypes.bool,
};
