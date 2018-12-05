import React, { Component } from 'react';
import { Link } from 'react-router';
import Nav from '../components/Nav';
import ViewTitle from '../components/ViewTitle';

class StyleGuide extends Component {
  render() {
    return(
      <div className="view style-guide">
        <h1>Style guide</h1>
        <div className="palette">
          <div className="color-swatch pink"></div>
          <div className="color-swatch green"></div>
          <div className="color-swatch orange"></div>
        </div>
        <div>
          <h1>This is a primary header</h1>
        </div>
        <div>
          <h2>This is a secondary header</h2>
        </div>
        <div>
          <h1>This is a button</h1>
          <div className="button">
            <div>Click me</div>
          </div>
        </div>
      </div>
    )
  }
};

export default StyleGuide;
