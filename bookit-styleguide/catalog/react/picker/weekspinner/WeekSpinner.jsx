import React from 'react'

import { getPreviousAndNextWeekDates, formatWeek, formatDate } from '../../../utils/dates-times.js'

export class WeekSpinner extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            viewingDate: formatDate(new Date),
        }

        this.updateViewingDate = this.updateViewingDate.bind(this)
    }


    updateViewingDate = date => this.setState({ viewingDate: date });

    render() {
        const { viewingDate } = this.state
        const [previousWeek, nextWeek] = getPreviousAndNextWeekDates(viewingDate)

        return (
            <div className='weekSpinner'>
                <div className='controls' onClick={() => this.updateViewingDate(previousWeek)}>
                    <span id="previous">&#12296;</span>
                </div>
                <div className='week'>
                    <p>{formatWeek(viewingDate)}</p>
                </div>
                <div className='controls' onClick={() => this.updateViewingDate(nextWeek)}>
                    <span  id="next">&#12297;</span>
                </div>
            </div>
        )
    }
}

WeekSpinner.defaultProps = {
    weekOf: formatDate(new Date)
};

export default WeekSpinner