import React, { PropTypes } from 'react';
import TableCell from 'components/1-atoms/TableCell';
import Spinner from 'components/1-atoms/Spinner';

const ValidationTable = ({ validationResult }) => {
  if (validationResult === null) {
    return <Spinner />;
  }

  const bodyRows = Reflect.ownKeys(validationResult)
  .map(key => [validationResult[key], key])
  .map(([value, system]) => {
    const bodyRow = [];
    bodyRow.push(<TableCell key={`${system}name`} cellValue={system} classes={value.status} />);
    bodyRow.push(
      <TableCell key={`${system}message`} cellValue={value.data ? value.data.message : ''} />
    );
    return (<tr
      key={system}
      className="tableBodyRow validation-table"
    >{bodyRow}</tr>);
  });

  if (bodyRows.length === 0) {
    return null;
  }

  return (
    <table className="table">
      <thead>
        <tr className="tableHeaderRow">
          <th className="tableHeaderCell">
            Project Validation
          </th>
        </tr>
        <tr className="tableHeaderRow">
          <th className="tableHeaderCell">
            System
          </th>
          <th className="tableHeaderCell">
            Message
          </th>
        </tr>
      </thead>
      <tbody>
        {bodyRows}
      </tbody>
    </table>
  );
};

export default ValidationTable;

ValidationTable.propTypes = {
  validationResult: PropTypes.object,
};
