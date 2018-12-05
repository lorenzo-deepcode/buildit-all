'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Header = function Header(_ref) {
  var _ref$logotype = _ref.logotype,
      logotype = _ref$logotype === undefined ? '' : _ref$logotype,
      _ref$pageName = _ref.pageName,
      pageName = _ref$pageName === undefined ? '' : _ref$pageName,
      onLogoClick = _ref.onLogoClick;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'div',
      { className: 'header' },
      _react2.default.createElement(
        'span',
        {
          className: 'logo',
          onClick: onLogoClick
        },
        logotype
      ),
      _react2.default.createElement(
        'span',
        { className: 'project-name' },
        pageName
      )
    )
  );
};

Header.propTypes = {
  logotype: _react2.default.PropTypes.string.isRequired,
  onLogoClick: _react2.default.PropTypes.func.isRequired,
  pageName: _react2.default.PropTypes.string
};

exports.default = Header;