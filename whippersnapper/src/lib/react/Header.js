import React from 'react';

const Header = ({ logotype = '', pageName = '', onLogoClick }) => (
  <div>
    <div className="header">
      <span
        className="logo"
        onClick={onLogoClick}
      >{logotype}</span>
      <span className="project-name">{pageName}</span>
    </div>
  </div>
);

Header.propTypes = {
  logotype: React.PropTypes.string.isRequired,
  onLogoClick: React.PropTypes.func.isRequired,
  pageName: React.PropTypes.string,
};

export default Header;
