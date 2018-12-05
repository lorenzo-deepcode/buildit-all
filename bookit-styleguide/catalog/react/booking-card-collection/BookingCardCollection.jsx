import React from 'react'

import BookingCardDateHeader from './BookingCardDateHeader'
import BookingCard from './BookingCard'

import { addDays } from '../../utils/dates-times.js'

const BookingCardCollection = ({
    today = new Date, 
    tomorrow = addDays(new Date, 1),
    bookingsToday = [
        {
            time: '3:45 PM - 4:40 PM',
            title: 'Meeting with Randy',
            room: 'Red Room (NYC)'
        },
        {
            time: '10:00 AM - 12:30 PM',
            title: 'Client Workshop: "Creating long titles for technical reasons"',
            room: 'Blue Room (NYC)'
        }
    ],
    bookingsTomorrow = [
        {
            time: '1:00 PM - 1:15 PM',
            title: 'Sketching with Sarah',
            room: 'Candy Room (LON)'
        }
    ]    
}) => {
    
    return (
        <div className="booking-card-collection">
            <BookingCardDateHeader date={today} />
            <div className="card-group">
                    {
                        bookingsToday.map((booking, index) => 
                            (<BookingCard key={index} time={booking.time} title={booking.title} room={booking.room} />)
                        )
                    }
                    </div>
            <BookingCardDateHeader date={tomorrow} />
            <div className="card-group">
                    {
                        bookingsTomorrow.map((booking, index) => 
                            <BookingCard key={index} time={booking.time} title={booking.title} room={booking.room} />
                        )
                    }
            </div>
        </div>
    )
}

export default BookingCardCollection