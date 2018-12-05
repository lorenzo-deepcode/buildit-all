import React, { Component } from 'react';
import OrderItem from './OrderItem';
import { connect } from 'react-redux';

// TODO: Provide via Redux store, via network request
const fakeOrder = [
  {
    desc: "Double Stacked Tacos- Nacho Crunch",
    price: 5,
    count: 6,
  },
  {
    desc: "Double Stacked Tacos- Nacho Crunch",
    price: 4,
    count: 5,
  },
  {
    desc: "Double Stacked Tacos- Nacho Crunch",
    price: 3,
    count: 4,
  },
  {
    desc: "Double Stacked Tacos- Nacho Crunch",
    price: 2,
    count: 3,
  },

]

const formatPrice = price => `${price.toFixed(2)}`

class OrderItemList extends Component {
  render() {
    return(

      <div className="order-list">
        {fakeOrder.map((item, index) => (
          <OrderItem
            key={index}
            desc={item.desc}
            price={formatPrice(item.price)}
            count={item.count}
          />
        ))}
      </div>
    )
  }
};

export default OrderItemList;
