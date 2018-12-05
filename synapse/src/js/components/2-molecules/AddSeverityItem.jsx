import React, { PropTypes, Component } from 'react';
import Button from 'whippersnapper/build/Button.js';

class AddSeverityItem extends Component {
  constructor() {
    super();
    this.state = {
      nameValue: '',
      groupWithValue: '',
      isValid: false,
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleGroupWithChange = this.handleGroupWithChange.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    event.preventDefault();
    this.props.onAddClick(this.state.nameValue, this.state.groupWithValue);
    this.setState({
      nameValue: '',
      groupWithValue: '',
      isValid: false,
    });
  }

  handleNameChange(event) {
    this.setState({
      nameValue: event.target.value,
      isValid: this.isValid(event.target.value),
    });
  }

  handleGroupWithChange(event) {
    this.setState({
      groupWithValue: event.target.value,
    });
  }

  isValid(value) {
    return value !== '';
  }

  render() {
    return (
      <div className="add-severity-item">
        <span>Name</span>
        <input
          value={this.state.nameValue}
          onChange={this.handleNameChange}
        />
        <span>Group With</span>
        <input
          value={this.state.groupWithValue}
          onChange={this.handleGroupWithChange}
        />
        <Button
          label="Add"
          cssClasses="button btn btn-secondary"
          onClick={this.onClick}
          disabled={!this.state.isValid}
        />
      </div>
    );
  }
}

export default AddSeverityItem;

AddSeverityItem.propTypes = {
  onAddClick: PropTypes.func.isRequired,
};
