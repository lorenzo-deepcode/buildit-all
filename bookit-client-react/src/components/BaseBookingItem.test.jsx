import React from 'react'
import { shallow } from 'enzyme'

import BaseBookingItem from 'Components/BaseBookingItem'

describe('<BaseBookingItem />', () => {
  const props = {
    id: 'abc',
    subject: 'A Booking',
    start: '2017-12-18T13:00',
    end: '2017-12-18T14:00',
    bookableName: 'Bookable Name',
  }

  it('renders with props', () => {
    const wrapper = shallow(<BaseBookingItem {...props} />)

    expect(wrapper).to.exist
  })

  it('[BKIT-91] includes locationName', () => {
    const expected = 'Swiggity Swooty'
    const newProps = { ...props, locationName: expected }
    const wrapper = shallow(<BaseBookingItem {...newProps} />)

    expect(wrapper.find('h3').text()).to.contain(expected)
  })
})
