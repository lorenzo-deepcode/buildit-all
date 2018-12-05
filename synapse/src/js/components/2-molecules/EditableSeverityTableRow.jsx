import React, { PropTypes } from 'react';
import Badge from 'components/1-atoms/Badge';
import Icon from 'components/1-atoms/Icon';

class EditableSeverityTableRow extends React.Component {
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
      <tr className="editable-severity-table-row">
        <td>
          <Badge label={(this.props.index + 1).toString()} />
        </td>
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

export default EditableSeverityTableRow;

EditableSeverityTableRow.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  itemsSize: PropTypes.number.isRequired,
  removeItem: PropTypes.func.isRequired,
  moveItemUp: PropTypes.func.isRequired,
  moveItemDown: PropTypes.func.isRequired,
};
