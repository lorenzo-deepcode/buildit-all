import React from 'react'
import { shallow } from 'enzyme'

import { BookingListItem } from 'Components/BookingListItem'

describe('<BookingListItem />', () => {
  const props = {
    id: 'abc',
    subject: 'A Booking',
    start: '2017-12-18T13:00',
    end: '2017-12-18T14:00',
    bookableName: 'Bookable Name',
  }

  it('renders with props', () => {
    const wrapper = shallow(<BookingListItem {...props} />)

    expect(wrapper).to.exist
  })

  it('wraps a <BaseBookingItem /> with a <Link />', () => {
    const wrapper = shallow(<BookingListItem {...props} />)

    expect(wrapper.find('Link').prop('to')).to.equal(`/bookings/${props.id}`)
  })
})
