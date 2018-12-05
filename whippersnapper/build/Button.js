'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Button = function Button(_ref) {
  var label = _ref.label,
      cssClasses = _ref.cssClasses,
      onClick = _ref.onClick,
      _ref$disabled = _ref.disabled,
      disabled = _ref$disabled === undefined ? false : _ref$disabled,
      _ref$id = _ref.id,
      id = _ref$id === undefined ? undefined : _ref$id;
  return _react2.default.createElement(
    'button',
    {
      className: 'button ' + cssClasses,
      onClick: onClick,
      disabled: disabled,
      id: id
    },
    label
  );
};

exports.default = Button;


Button.propTypes = {
  label: _react2.default.PropTypes.string.isRequired,
  id: _react2.default.PropTypes.string,
  cssClasses: _react2.default.PropTypes.string.isRequired,
  onClick: _react2.default.PropTypes.func.isRequired,
  disabled: _react2.default.PropTypes.bool
};