"use strict";

var React = require('react');

module.exports = React.createClass({
  displayName: "exports",

  render: function render() {
    return React.createElement(
      "span",
      { className: "badge" },
      "Oh"
    );
  }
});