const React = require('react');

module.exports = React.createClass({
  render: function render() {
    const v = this.props.appVersion
    const appVersionString = v ? `Version: ${v}`: '';
    return (
      <div className="footer">
        <span className="app-version">{appVersionString}</span>
      </div>
    )
  }
})
