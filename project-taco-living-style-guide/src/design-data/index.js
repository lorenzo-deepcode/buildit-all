import React from 'react'
import menuCategoryItemData from './menu-category-item'
import menuCategoryListData from './menu-category-list'
import menuItemListData from './menu-item-list'
import menuItemData from './menu-item'
import navData from './nav'
import placeHolderImageData from './placeholder-image'
import quantityPickerData from './quantity-picker'
import tacoCrumbsData from './taco-crumbs'
import viewButtonPink from './button-large-pink'
import viewButtonWhite from './button-large-white'
import viewButtonSmall from './button-small'
import viewLocationHeader from './pickup-location-header'
import viewOrderItem from './order-item'

const components = [
  navData,
  viewButtonPink,
  viewButtonWhite,
  viewButtonSmall,
  tacoCrumbsData, // not present in taco-style
  menuCategoryItemData, // not present
  menuCategoryListData, // class name had typo in taco-style. Fixed, check if it worked.
  quantityPickerData, // okay
  menuItemData, // Some styles coming through. Not all.
  menuItemListData, // not present
  viewLocationHeader,
  viewOrderItem,
]

export default components
