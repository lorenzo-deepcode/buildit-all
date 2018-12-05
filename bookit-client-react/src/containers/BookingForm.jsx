import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { compose } from 'redux'

import { Link } from 'react-router-dom'

import { Field, reduxForm, isSubmitting, change, touch } from 'redux-form'

import DayPickerInput from 'react-day-picker/DayPickerInput'
import TimePicker from 'rc-time-picker-date-fns'

import { actionCreators, selectors } from 'Redux'

import Button from 'Components/Button'
import Loading from 'Components/Loading'

import arrowRightSrc from 'Images/input-arrow-right.svg'
import downArrow from 'Images/downArrow.svg'
import closeSrc from 'Images/close.svg'

import {
  addHours,
  isToday,
  isBefore,
  isAfter,
  formatDate,
  parseDate,
  normalizeDateWithBase,
} from 'Utils'

import 'react-day-picker/lib/style.css'
import 'rc-time-picker-date-fns/assets/index.css'

import styles from 'Styles/form.scss'

const required = value => (value ? undefined : 'Required')

const endAfterStart = (value, { start }) => {
  try {
    if (isBefore(value, start)) {
      return 'End must be after start'
    }
  }
  catch (error) { } // eslint-disable-line
}

const startBeforeEnd = (value, {end}) => {
  try {
    if (isAfter(value, end)) {
      return 'Start must be before end'
    }
  }
  catch (error) { } // eslint-disable-line
}

const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <div className={ styles.field }>
    <label id={label.replace(/\s/g, '-').toLowerCase()}>{label}</label>
    <div className={ styles.fieldInput }>
      <input {...input} placeholder={label} type={type} />
      { touched &&
        ((error && <span className={styles.errorSpan}>{error}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  </div>
)

renderField.propTypes = {
  input: PropTypes.any,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
}

const renderDayPicker = ({ input, label, meta: { touched, error, warning }, clearRoom }) => {
  const onDayChange = (day) => {
    input.onChange(day)
    clearRoom()
  }
  const disabledDays = day => !isToday(day) && isBefore(day, new Date)

  const inputProps = {
    name: input.name,
    onClick: input.onClick,
    onFocus: input.onFocus,
    onKeyDown: input.onKeyDown,
    onKeyUp: input.onKeyUp,
    readOnly: 'readonly',
  }
  const dayPickerProps = {
    todayButton: 'Today',
    disabledDays: disabledDays,
    fromMonth: new Date,
  }

  return (
    <div className={ styles.field }>
      <label>{ label }</label>
      <div className={ styles.fieldInput }>
        <DayPickerInput
          format="ddd, MMMM D, YYYY"
          placeholder="Select Booking Date"
          value={input.value}
          formatDate={formatDate}
          parseDate={parseDate}
          onDayChange={onDayChange}
          inputProps={inputProps}
          dayPickerProps={dayPickerProps}
        />
        { touched &&
          (
            (error && <span className={ styles.errorSpan }>{ error }</span>) ||
            (warning && <span>{ warning }</span>)
          )
        }
      </div>
    </div>
  )
}

renderDayPicker.propTypes = renderField.propTypes

const renderTimePicker = ({ input, label, meta: { touched, error, warning }, touch, clearRoom }) => {  // eslint-disable-line
  const { onChange, onBlur, ...props } = input  // eslint-disable-line

  const onTimeChange = (value) => {
    input.onChange(value)
    touch('booking', input.name)
    clearRoom()
  }

  return (
    <div className={ styles.field }>
      <label>{ label }</label>
      <div className={ styles.fieldInput }>
        <TimePicker {...props} onChange={onTimeChange} showSecond={false} allowEmpty={false} />
        { touched &&
          (
            (error && <span className={ styles.errorSpan }>{ error }</span>) ||
            (warning && <span>{ warning }</span>)
          )
        }
      </div>
    </div>
  )
}

renderTimePicker.propTypes = renderField.propTypes

const renderSelect = (locations = [], onChange) => (
  <Field name="locationId" className={ styles.locationSelectDropdown } component="select" onChange={onChange}>
    {locations.map(location => (
      <option value={location.id} key={location.id}>
        {location.name}
      </option>
    ))}
  </Field>
)

const roomSelectToggle = (selectedRoomName = 'Pick A Room') => (
  <div className={styles.roomSelectToggleInput} id={selectedRoomName.replace(/\s/g, '-').toLowerCase()}>
    <span>{selectedRoomName}</span>
    <img src={arrowRightSrc} alt="Select a room"/>
  </div>
)


export class BookingForm extends React.Component {
  componentDidMount() {
    const { locations, initialize, getAllLocations } = this.props

    const date = new Date
    const start = date
    const end = addHours(date, 1)

    const values = { date, end, start }

    if (!this.hasLocations()) {
      getAllLocations()
    } else {
      values.locationId = locations[0].id
    }

    initialize(values)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.locations.length !== this.props.locations.length) {
      this.props.change('booking', 'locationId', this.props.locations[0].id)
    }
  }

  submitBookingForm = (values) => {
    return Promise.resolve().then(() => {
      this.props.createBooking({
        ...values,
        start: formatDate(normalizeDateWithBase(values.start, values.date), 'YYYY-MM-DDTHH:mm:ss'),
        end: formatDate(normalizeDateWithBase(values.end, values.date), 'YYYY-MM-DDTHH:mm:ss'),
        date: undefined,
      })
    })
  }

  clearRoom = () => {
    this.props.change('booking', 'bookableId', '')
  }

  hasLocations = () => {
    return this.props.locations
    && this.props.locations.length > 0
  }

  render() {
    const {
      handleSubmit,
      submitting,
      pristine,
      invalid,
      error,
      setBookablesVisible,
      bookableName,
      locations,
      touch,
    } = this.props

    if (!this.hasLocations()) {
      return <div><Loading /></div>
    }

    return (
      <div className={ styles.bookingForm }>
        <Link to="/home" className={ styles.cancel }>
          <img src={closeSrc} alt="Closing booking form and go home"/>
        </Link>

        <form onSubmit={ handleSubmit(this.submitBookingForm) }>

          <div className={ styles.heading }>
            <h2 className={ styles.title }>Book A Room in { renderSelect(locations, this.clearRoom) }</h2>
            <img src={downArrow} alt="Go Back" className={ styles.titleDropdown } />
          </div>

          { error && <strong>{ error }</strong> }
          <h5 className={ styles.disclaimer }>All times local to selected location</h5>

          <Field name="date" component={ renderDayPicker } label="Date" validate={ [ required ] } clearRoom={this.clearRoom} />

          <div className={styles.fieldTwoColumn}>
            <Field name="start" component={ renderTimePicker } label="Start" validate={ [ required, startBeforeEnd ] } clearRoom={this.clearRoom} touch={touch} />
            <Field name="end" component={ renderTimePicker } label="End" type="text" validate={ [ required, endAfterStart ] } clearRoom={this.clearRoom} touch={touch} />
          </div>

          <Field name="bookableId" component={ renderField } type="hidden" label="Room" />
          <a href="#" onClick={(event) => {
            event.preventDefault()
            setBookablesVisible(true)
          }} className={`${styles.roomsToggle} roomsInput`}>{roomSelectToggle(bookableName)}</a>

          <Field name="subject" component={ renderField } label="Event Name" type="text" validate={ required } />

          <div className={ styles.field }>
            <Button type="submit" disabled={ pristine || submitting || invalid } id="bookit" className={ styles.submitButton }>
              Book A Room
            </Button>
          </div>
        </form>

      </div>
    )
  }
}

BookingForm.propTypes = {
  handleSubmit: PropTypes.func,
  createBooking: PropTypes.func,
  submitting: PropTypes.bool,
  bookingInstanceId: PropTypes.string,
  initialize: PropTypes.func,
  pristine: PropTypes.bool,
  invalid: PropTypes.bool,
  error: PropTypes.string,
  setBookablesVisible: PropTypes.func,
  bookableName: PropTypes.string,
  bookingFormDate: PropTypes.any,
  locations: PropTypes.arrayOf(PropTypes.object),
  getAllLocations: PropTypes.func,
  change: PropTypes.func,
  touch: PropTypes.func,
}

const mapStateToProps = state => ({
  bookingInstanceId: selectors.getBookingInstanceId(state),
  submitting: isSubmitting('booking')(state),
  bookableName: selectors.getBookingFormBookableName(state),
  bookingFormDate: selectors.getBookingFormDate(state),
  locations: selectors.getLocationOptions(state),
})

const enhance = compose(
  reduxForm({ form: 'booking' }),
  connect(mapStateToProps, {
    createBooking: actionCreators.createBooking,
    getAllLocations: actionCreators.getAllLocations,
    change,
    touch,
  })
)

export default enhance(BookingForm)
