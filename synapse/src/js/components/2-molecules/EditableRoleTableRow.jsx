import React, { PropTypes } from 'react';
import Icon from 'components/1-atoms/Icon';

class EditableRoleTableRow extends React.Component {

  constructor() {
    super();
    this.removeItemOnClick = this.removeItemOnClick.bind(this);
    this.moveItemUpOnClick = this.moveItemUpOnClick.bind(this);
    this.moveItemDownOnClick = this.moveItemDownOnClick.bind(this);
  }
  removeItemOnClick() {
    this.props.removeItem(this.props.index);
  }

  moveItemUpOnClick() {
    this.props.moveItemUp(this.props.index);
  }

  moveItemDownOnClick() {
    this.props.moveItemDown(this.props.index);
  }

  render() {
    const item = this.props.item;
    const index = this.props.index;
    const itemsSize = this.props.itemsSize;
    const actions = [];
    switch (index) {
    case 0:
      if (itemsSize > 1) {
        actions.push(<Icon
          icon="fa fa-times-circle"
          onClick={this.removeItemOnClick}
        />);
        actions.push(<span></span>);
        actions.push(<Icon
          icon="fa fa-arrow-circle-down"
          onClick={this.moveItemDownOnClick}
        />);
      } else {
        actions.push(<Icon
          icon="fa fa-times-circle"
          onClick={this.removeItemOnClick}
        />);
      }
      break;
    case itemsSize - 1:
      actions.push(<Icon
        icon="fa fa-times-circle"
        onClick={this.removeItemOnClick}
      />);
      actions.push(<Icon
        icon="fa fa-arrow-circle-up"
        onClick={this.moveItemUpOnClick}
      />);
      break;
    default:
      actions.push(<Icon
        icon="fa fa-times-circle"
        onClick={this.removeItemOnClick}
      />);
      actions.push(<Icon
        icon="fa fa-arrow-circle-up"
        onClick={this.moveItemUpOnClick}
      />);
      actions.push(<Icon
        icon="fa fa-arrow-circle-down"
        onClick={this.moveItemDownOnClick}
      />);
    }

    return (
      <tr className="editable-role-table-row">
        <td>
          <span>{item.name}</span>
        </td>
        <td>
          <span>{item.groupWith}</span>
        </td>
        <td className="actions">
          {actions.map((action, i) => (
            <span key={i}>{action}</span>
          ))}
        </td>
      </tr>
    );
  }
}

export default EditableRoleTableRow;

EditableRoleTableRow.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  itemsSize: PropTypes.number.isRequired,
  removeItem: PropTypes.func.isRequired,
  moveItemUp: PropTypes.func.isRequired,
  moveItemDown: PropTypes.func.isRequired,
};
