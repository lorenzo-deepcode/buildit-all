import React from 'react'

const ListView = ({
    rooms= [
        {
            name: "Red Room",
            closed: false,
            reason: ''
        },
        {
            name: "Blue Room",
            closed: false,
            reason: ''
        },
        {
            name: "Green Room",
            closed: true,
            reason: 'Booked'
        },
        {
            name: "Yellow Room",
            closed: true,
            reason: 'Not bookable'
        }
    ]
}) => (
    <div className="listview-wrapper">
        {rooms.map((room, index) => (
                <div className="listview-item" key={index}>
                    <h4>{room.name}</h4>
                    {room.closed && <p>{room.reason}</p>}
                </div>
        ))}
    </div>
);

export default ListView