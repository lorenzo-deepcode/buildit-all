import React, { Component } from 'react';
import { Link } from 'react-router';
import Nav from '../components/Nav';
import TacoCrumbs from '../components/TacoCrumbs';
import PlaceholderImage from '../components/PlaceholderImage';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

class Location extends Component {
  render() {
    return(
      <div className="main-container">
      <div className="view-location">
        <TacoCrumbs
          viewName="choose a restaurant"
          cartCount={this.props.cartCount}
          />
        <div className="map-container">
          <img src="../assets/images/map.png" className="map"/>
        </div>
        <div className="search-container">
          <div className="search-input"></div>
            <div className="button-search">
            <Link to="/">  Search </Link>
            </div>
        </div>
        <div className="list-container">
          <div className="list-item">
            <div className="mile-marker-container">
              <img src="../assets/images/marker-1.png" />
                <div className="miles-text">
                  0.1 MI
                </div>
            </div>
            <div className="list-item-content">
              <div className="location-address">
              18 E. 14th Street New York, NY 10003
              </div>
              <div className="select-location-button">
                <div className="select-location-text">
                <Link to="/menu" onClick={() => {
                    this.props.selectAddressOne();
                  }}>  Select Location </Link>
                </div>
              </div>
            </div>
            <div className="expand">
              <img src="../assets/images/expand.png" />
            </div>
        </div>
        <div className="list-item">
          <div className="mile-marker-container">
            <img src="../assets/images/marker-2.png" />
              <div className="miles-text">
                0.3 MI
              </div>
          </div>
          <div className="list-item-content">
            <div className="location-address">
            390 8th Avenue New York, NY 10001
            </div>
            <div className="select-location-button">
              <div className="select-location-text">
                <Link to="/menu" onClick={() => {
                    this.props.selectAddressTwo();
                  }}>  Select Location </Link>
              </div>
            </div>
          </div>
          <div className="expand">
            <img src="../assets/images/expand.png" />
          </div>
      </div>
      <div className="list-item">
        <div className="mile-marker-container">
          <img src="../assets/images/marker-3.png" />
            <div className="miles-text">
              0.4 MI
            </div>
        </div>
        <div className="list-item-content">
          <div className="location-address">
          77 Sands Street Crooklyn, NY 11234
          </div>
          <div className="select-location-button">
            <div className="select-location-text">
              <Link to="/menu" onClick={() => {
                  this.props.selectAddressThree();
                }}>  Select Location </Link>
            </div>
          </div>
        </div>
        <div className="expand">
          <img src="../assets/images/expand.png" />
        </div>
    </div>
      </div>
        <Nav />
      </div>
    </div>
    )
  }
};

const mapStateToProps = (state) => {
  return {
    cartCount: state.cartCount,
    orderAddress: state.orderAddress,
    orderState: state.orderState
  }
}

const mapDispatchToProps = (dispatch) => {
  const selectAddressOne = () => {
    dispatch ({
      type: "SELECT_ADDRESS_ONE"
    });
  };
  const selectAddressTwo = () => {
    dispatch ({
      type: "SELECT_ADDRESS_TWO"
    });
  };
  const selectAddressThree = () => {
    dispatch ({
      type: "SELECT_ADDRESS_THREE"
    });
  };
  return {
    selectAddressOne: selectAddressOne,
    selectAddressTwo: selectAddressTwo,
    selectAddressThree: selectAddressThree
  }
}

const ConnectedLocation = connect (mapStateToProps, mapDispatchToProps) (Location)

export default ConnectedLocation;
