import React, { Component } from 'react';
import { Link } from 'react-router';

class Nav extends Component {
  render() {
    return(
      <div className="nav">
        <Link to="/">
          <span className="nav-item">home</span>
        </Link>
        <Link to="/history">
          <span className="nav-item">history</span>
        </Link>
        <Link to="/location">
          <span className="nav-item">location</span>
        </Link>
        <Link to="/location">
          <span className="nav-item">account</span>
        </Link>
      </div>
    )
  }
};

export default Nav;
