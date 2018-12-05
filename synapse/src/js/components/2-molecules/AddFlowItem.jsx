import React, { PropTypes, Component } from 'react';
import Button from 'whippersnapper/build/Button.js';

class AddFlowItem extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
      isValid: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    event.preventDefault();
    this.props.onAddClick(this.state.value);
    this.setState({
      value: '',
      isValid: false,
    });
  }

  isValid(value) {
    return value !== '';
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
      isValid: this.isValid(event.target.value),
    });
  }

  render() {
    return (
      <div className="add-flow-item">
        <span>Name</span>
        <input
          value={this.state.value}
          onChange={this.handleChange}
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

export default AddFlowItem;

AddFlowItem.propTypes = {
  onAddClick: PropTypes.func.isRequired,
};
