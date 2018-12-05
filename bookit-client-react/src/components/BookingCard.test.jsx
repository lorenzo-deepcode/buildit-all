import React from 'react'
import { shallow } from 'enzyme'

import BookingCard from 'Components/BookingCard'

describe('<BookingCard />', () => {
  const props = {
    id: 'abc',
    subject: 'A Booking',
    start: '2017-12-18T13:00',
    end: '2017-12-18T14:00',
    bookableName: 'Bookable Name',
  }

  it('renders with props', () => {
    const wrapper = shallow(<BookingCard {...props} />)

    expect(wrapper).to.exist
  })
})
