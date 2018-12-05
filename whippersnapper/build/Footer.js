'use strict';

var React = require('react');

module.exports = React.createClass({
  displayName: 'exports',

  render: function render() {
    var v = this.props.appVersion;
    var appVersionString = v ? 'Version: ' + v : '';
    return React.createElement(
      'div',
      { className: 'footer' },
      React.createElement(
        'span',
        { className: 'app-version' },
        appVersionString
      )
    );
  }
});