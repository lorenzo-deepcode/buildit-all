import React from 'react';
import {Button} from '..';
import logo from '../assets/brandai/unicorn_inc.png';

const Header = (props) => {
  return (
    <header className="dsdemo-header">
      <div>
        <div className="logo">
          <img src={logo} alt="Unicorn Inc"/>
        </div>
        <h1>{props.title}</h1>
      </div>

      <nav>
        <ul>
          <li><Button href="/">Home</Button></li>
          <li><Button href="/">My Account</Button></li>
          <li><Button href="/">Services</Button></li>
          <li><Button href="/">Contact Us</Button></li>
        </ul>
      </nav>

    </header>
  )
};

export default Header;
