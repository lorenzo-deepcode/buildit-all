"use strict";

var React = require('react');

module.exports = React.createClass({
  displayName: "exports",

  render: function render() {
    return React.createElement(
      "div",
      { className: "text" },
      React.createElement(
        "span",
        { className: "text-label" },
        this.props.label
      ),
      React.createElement(
        "span",
        { className: "text-content" },
        this.props.content
      )
    );
  }
});