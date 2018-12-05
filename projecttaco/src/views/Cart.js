import React, { Component } from 'react';
import { Link } from 'react-router';
import Nav from '../components/Nav';
import TacoCrumbs from '../components/TacoCrumbs';
import ViewTitle from '../components/ViewTitle';
import PlaceholderImage from '../components/PlaceholderImage';
import SubTotalBlock from '../components/SubTotalBlock';
import ReviewOrderHeader from '../components/ReviewOrderHeader';
import OrderItemList from '../components/OrderItemList';
import { browserHistory } from 'react-router';
import Notifier from 'notifications';
import { connect } from 'react-redux';


class Cart extends Component {
  render() {
    return(
      <div className="view-cart">
        <TacoCrumbs
          viewName="cart"
          cartCount={this.props.cartCount}
          />
          <div className="promo">
            <div className="add-button-container">
            <div className="button-add">
              <Link to="/location">Add to Order</Link>
            </div>
          </div>
          </div>
        <div>
          <ReviewOrderHeader
            review="Review Order"
            count={this.props.cartCount}
            />
          <div className="order-list">
            <OrderItemList/>
          </div>
          <div className="total-plain">
            <span className="subtotal-plain">
              Subtotal
            </span>
            <span className="amount-plain">
              $11.98
            </span>
          </div>
          <div className="total-plain">
            <span className="subtotal-plain">
              Tax
            </span>
            <span className="amount-plain">
              TBD
            </span>
          </div>
          <SubTotalBlock
            subtotal="Subtotal"
            amount="$11.98"
            />
          <div className="pick-up">
            <div className="pick-up-location-small">
              Pick up location
            </div>
            <div className="pick-up-change-location">
            <Link to="/location">  change location </Link>
            </div>
          </div>
          <div className="cart-list-holder">
          <div className="cart-block">
          <div className="cart-info">
            <div className="cart-list-holder-address">
              {this.props.orderAddress}<br/> {this.props.orderState}
            </div>
            <div className="directions">
              get directions
            </div>
          </div>
          <div className="cart-image">
            <img src="../assets/images/map.png" className="cart-image"/>
          </div>
          </div>
        </div>
        <div className="pick-up">
          <div className="pick-up-location-large">
          payment information
          </div>
        </div>
        <div className="payment">
          <div className="radio-button">
            <img src="../assets/images/radio-button.png" />
          </div>
          <div className="payment-info">
            <span className="cc-info">VISA ****0732</span>
            <br/>
            <span className="cc-exp">Expires 05/2018</span>
          </div>
          <div className="payment-expand">
              <img src="../assets/images/expand.png" />
          </div>
        </div>
        <div className="divider" />
          <div className="payment">
            <div className="radio-button">
              <img src="../assets/images/radio-button.png" />
            </div>
            <div className="payment-info">
              <span className="cc-info">GIFT CARD</span>
              <br/>
              <span className="cc-exp">$12.32 remaining</span>
            </div>
            <div className="payment-expand">
                <img src="../assets/images/expand.png" />
            </div>
          </div>
          <div className="terms">
            <div className="terms-header">
              Terms and Conditions
            </div>
            <div className="terms-content">
              I here by agree to Taco Bell’s Terms & Conditions and understand that a SMS message will be delivered to my mobile devise provided in account settings.
            </div>
          </div>
          <div className="place-order">
            <div className="sub">
              subtotal $25.72
            </div>
            <div>
              <div className="button-reorder">
                <Link to="/receipt">Place Order</Link>
              </div>
            </div>
          </div>
        </div>
        <Nav />
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

const ConnectedCart = connect (mapStateToProps) (Cart)

export default ConnectedCart;
