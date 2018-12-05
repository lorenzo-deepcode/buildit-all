import React from 'react'
import OrderItem from 'taco-components/components/1-Atoms/OrderItem';

const viewOrderItem = {
    name: "Order Item",
    component: (
      <OrderItem
        desc="Double Stacked Tacos- Nacho Crunch"
        price="5.00"
        count="5"
      />
    ),
    type: "order",
    description: 'Displays a single order item.',
    reactComponent: "OrderItem",
    reactComponentLibrary: "TacoComponents",
    context: {
      children: [],
      parents: ["OrderItemList"]
    },
    style: {},
    approved: false,
  }

export default viewOrderItem
