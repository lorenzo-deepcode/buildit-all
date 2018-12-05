import React, { Component } from 'react';
import { Link } from 'react-router';
import Nav from '../components/Nav';
import ViewTitle from '../components/ViewTitle';
import PickUpLocationHeader from '../components/PickUpLocationHeader';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

class Receipt extends Component {
  render() {
    return(
      <div className="view-receipt">
        <div className="header">
          <div className="header-text">
            order confirmation
          </div>
          <div className="cart-button">
          <Link to="/">  <img src="../assets/images/close-button.png" /></Link>
          </div>
        </div>
        <div className="hero">
          <div className="yass">
            <img src="../assets/images/yass-time-to-feast.png" />
          </div>
        </div>
        <div className="order-large">
          Order: 012546
        </div>
        <PickUpLocationHeader
          locationHeader="pick up location"
          timeHeader="pick up time"
          />
        <div className="pick-up-info">
          <div className="pick-up-address">
            {this.props.orderAddress}<br/>{this.props.orderState}
          </div>
          <div className="pick-up-ready-time">
            Ready after 02:35pm
          </div>
        </div>
        <div className="pick-up-link">
          <div className="directions">
            get directions
          </div>
          <div className="pick-up-later">
            schedule for later
          </div>
        </div>
        <div className="button-add-order">
          <Link to="/menu">add an order</Link>
        </div>
        <Nav />
      </div>
    )
  }
};

const mapStateToProps = (state) => {
  return {
    orderAddress: state.orderAddress,
    orderState: state.orderState
  }
}

const ConnectedReceipt= connect (mapStateToProps) (Receipt)

export default ConnectedReceipt;
