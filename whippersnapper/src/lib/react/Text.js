const React = require('react')

module.exports = React.createClass({
  render: function() {
    return (
      <div className="text">
        <span className="text-label">{this.props.label}</span>
        <span className="text-content">{this.props.content}</span>
      </div>
    )
  }
})
