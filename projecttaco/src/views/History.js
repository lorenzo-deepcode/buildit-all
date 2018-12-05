import React, { Component } from 'react';
import { Link } from 'react-router';
import Nav from '../components/Nav';
import TacoCrumbs from '../components/TacoCrumbs';
import MenuCategoryListHistory from '../components/MenuCategoryListHistory';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

class History extends Component {
  render() {
    return(
      <div className="view-history">
        <TacoCrumbs
          viewName="choose a restaurant"
          cartCount={this.props.cartCount}
          />
        <MenuCategoryListHistory />
        <div className="order-list-holder">
        <div className="order-block">
        <div className="order-info">
          <span className="order-number">ORDER: 103116</span>
          <span><img src="../assets/images/bookmark.png" className="bookmark"/></span>
          <div className="order-address">
            18 E 14th Street,<br/> New York, NY 10003
          </div>
          <div className="reorder">
            <div className="button-reorder">
              <Link to="/cart">re-order</Link>
            </div>
          </div>
        </div>
        <div className="order-image">
          <img src="../assets/images/order-image.png" className="order-image"/>
        </div>
        <div className="order-expand">
          <img src="../assets/images/expand-up.png"/>
        </div>
        </div>
        <div className="order-history-list">
          <div className="order-history-item">
            <span className="history-count">2</span>
            <span className="history-desc">Cheesy Gordita Crunch</span>
            <span className="history-price">$5.00</span>
          </div>
          <div className="order-history-item">
            <span className="history-count">2</span>
            <span className="history-desc">Cheesy Gordita Crunch</span>
            <span className="history-price">$5.00</span>
          </div>
          <div className="order-history-item">
            <span className="history-count">2</span>
            <span className="history-desc">Cheesy Gordita Crunch</span>
            <span className="history-price">$5.00</span>
          </div>
          <div className="order-history-item">
            <span className="history-count">2</span>
            <span className="history-desc">Cheesy Gordita Crunch</span>
            <span className="history-price">$5.00</span>
          </div>
          <div className="order-history-item">
            <span className="history-count">2</span>
            <span className="history-desc">Cheesy Gordita Crunch</span>
            <span className="history-price">$5.00</span>
          </div>
        </div>
        </div>
        <div className="total">
          <span className="subtotal">
            Subtotal
          </span>
          <span className="amount">
            $11.98
          </span>
        </div>
        <div className="order-list-holder">
        <div className="order-block">
        <div className="order-info">
          <span className="order-number">ORDER: 103116</span>
          <span><img src="../assets/images/bookmark.png" className="bookmark"/></span>
          <div className="order-address">
            18 E 14th Street,<br/> New York, NY 10003
          </div>
          <div className="reorder">
            <div className="button-reorder">
              <Link to="/cart">re-order</Link>
            </div>
          </div>
        </div>
        <div className="order-image">
          <img src="../assets/images/order-image.png" className="order-image"/>
        </div>
        <div className="order-expand">
          <img src="../assets/images/expand.png"/>
        </div>
        </div>
        </div>
        <div className="order-list-holder">
        <div className="order-block">
        <div className="order-info">
          <span className="order-number">ORDER: 103116</span>
          <span><img src="../assets/images/bookmark.png" className="bookmark"/></span>
          <div className="order-address">
            18 E 14th Street,<br/> New York, NY 10003
          </div>
          <div className="reorder">
            <div className="button-reorder">
              <Link to="/cart">re-order</Link>
            </div>
          </div>
        </div>
        <div className="order-image">
          <img src="../assets/images/order-image.png" className="order-image"/>
        </div>
        <div className="order-expand">
          <img src="../assets/images/expand.png"/>
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
    cartCount: state.cartCount
  }
}

const ConnectedHistory= connect (mapStateToProps) (History)

export default ConnectedHistory;
