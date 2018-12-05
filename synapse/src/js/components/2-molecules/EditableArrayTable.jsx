import React, { PropTypes } from 'react';
import EditableRoleTableRow from 'components/2-molecules/EditableRoleTableRow';

const EditableArrayTable = ({ items, removeItem, moveItemUp, moveItemDown }) => {
  const bodyRows = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    bodyRows.push(
      <EditableRoleTableRow
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

export default EditableArrayTable;

EditableArrayTable.propTypes = {
  items: PropTypes.array.isRequired,
  removeItem: PropTypes.func.isRequired,
  moveItemUp: PropTypes.func.isRequired,
  moveItemDown: PropTypes.func.isRequired,
};
