import React, { Component } from 'react';
import { Link } from 'react-router';

class Nav extends Component {
  render() {
    return(
      <div className="nav">
        <Link to="/menu">
          <span className="nav-item">order</span>
        </Link>
        <Link to="/history">
          <span className="nav-item">history</span>
        </Link>
        <Link to="/location">
          <span className="nav-item">locate</span>
        </Link>
        <Link to="/account">
          <span className="nav-item">account</span>
        </Link>
      </div>
    )
  }
};

export default Nav;
