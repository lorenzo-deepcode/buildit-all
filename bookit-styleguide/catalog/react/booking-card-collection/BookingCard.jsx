import React from 'react'

const BookingCard = ({time, title, room }) => {

    return (
        <div className="bookingCard">
            <p>{time}</p>
            <p>{title}</p>
            <p>{room}</p>
        </div>
    )
}

export default BookingCard