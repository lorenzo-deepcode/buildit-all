import React from 'react'

import { isToday, formatDate } from '../../utils/dates-times.js'


const BookingCardDateHeader = ({date}) => (
  <div className={` ${"booking-card-date-header"} ${isToday(date) ? "isToday" : ''}`}>
    <div className="heading">
      <h2 className="title">
        {isToday(date) && 'TODAY - '}
        {formatDate(date, 'ddd MMM D').toUpperCase()}
      </h2>
    </div>
  </div>
)
    
    
    
export default BookingCardDateHeader
