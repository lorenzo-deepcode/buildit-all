import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Nav from '../components/Nav';
import TacoCrumbs from '../components/TacoCrumbs';
import PlaceholderImage from '../components/PlaceholderImage';
import ButtonLargePink from '../components/ButtonLargePink';
import ButtonLargeWhite from '../components/ButtonLargeWhite';

export default class Landing extends Component {
  render() {
    return(
      <div className="main-container">
      <div className="landing-container">
        <div className="logo">
          <img src="../assets/images/logo.png"/>
        </div>
          <img src="../assets/images/welcome-back.png" className="welcome"/>
            <div className="button-container">
              <ButtonLargePink
                buttonText='Recent Order'
                ButtonLink="/history"
                />
                <ButtonLargeWhite
                    buttonText='New Order'
                    ButtonLink="/location"
                    />
        </div>
        <div>
        <Nav />
        </div>
      </div>
      </div>
    )
  }
};
