import React from 'react'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css';

const handleDayChange = (day) => {
    // console.log(day);
}

const DatePicker = ({ }) => (
    <div className="datepicker-field">
        <label>Date</label>
        <div className="fieldInput">
            <DayPickerInput onDayChange={this.handleDayChange} />
        </div>
</div >
)

export default DatePicker