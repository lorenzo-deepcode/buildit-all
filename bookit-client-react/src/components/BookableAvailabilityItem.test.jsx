import React from 'react'
import { shallow } from 'enzyme'

import BookableAvailabilityItem from 'Components/BookableAvailabilityItem'

describe('<BookableAvailabilityItem />', () => {
  const props = {
    bookableId: 'abc',
    name: 'Bookable',
    closed: false,
    reason: null,
    onClick: jest.fn(),
  }

  it('renders without a closed reason when `closed` is false', () => {
    const wrapper = shallow(<BookableAvailabilityItem {...props} />)
    expect(wrapper).to.exist
  })

  it('renders with a closed reason when `closed` is true', () => {
    const propsCopy = { ...props, closed: true, reason: 'A Reason for closure' }
    const wrapper = shallow(<BookableAvailabilityItem {...propsCopy} />)

    expect(wrapper.find('p').text()).to.equal(propsCopy.reason)
  })

  it('calls `onClick` when `closed` is false', () => {
    const wrapper = shallow(<BookableAvailabilityItem {...props} />)

    wrapper.find('div').simulate('click')

    expect(props.onClick.mock.calls).to.have.lengthOf(1)
  })

  it('should show a text "Free until %TIME%" if room is not closed representing the nearest time this particular room will be occupied', () => {
    const propsCopy = { ...props, closed: false, freeUntil: '2018-04-23T12:33' }
    const wrapper = shallow(<BookableAvailabilityItem {...propsCopy} />)

    expect(wrapper.find('p').text()).to.equal('Free until 12:33')
  })

  it('should show a text "Free all day" if room is not closed and if this room will be available to the end the day', () => {
    const propsCopy = { ...props, closed: false, freeUntil: null }
    const wrapper = shallow(<BookableAvailabilityItem {...propsCopy} />)

    expect(wrapper.find('p').text()).to.equal('Free all day')
  })
})
