import React, { PropTypes } from 'react';
import EditableSeverityTableRow from 'components/2-molecules/EditableSeverityTableRow';

const EditableSeverityTable = ({ items, removeItem, moveItemUp, moveItemDown }) => {
  const bodyRows = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    bodyRows.push(
      <EditableSeverityTableRow
        item={item}
        key={i}
        index={i}
        itemsSize={items.length}
        removeItem={removeItem}
        moveItemUp={moveItemUp}
        moveItemDown={moveItemDown}
      />
    );
  }

  return (
    <table className="table">
      <thead>
        <tr className="tableHeaderRow">
          <th className="tableHeaderCell">
            Sequence
          </th>
          <th className="tableHeaderCell">
            Name
          </th>
          <th className="tableHeaderCell">
            Group With
          </th>
        </tr>
      </thead>
      <tbody>
        {bodyRows}
      </tbody>
    </table>
  );
};

export default EditableSeverityTable;

EditableSeverityTable.propTypes = {
  items: PropTypes.array.isRequired,
  removeItem: PropTypes.func.isRequired,
  moveItemUp: PropTypes.func.isRequired,
  moveItemDown: PropTypes.func.isRequired,
};
