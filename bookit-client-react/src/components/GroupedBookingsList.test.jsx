import React from 'react'
import { shallow } from 'enzyme'

import { GroupedBookingsList } from 'Components/GroupedBookingsList'

import { formatDate } from 'Utils'

describe('<GroupedBookingsList />', () => {
  const AComponent = ({ id }) => <div>{ id }</div>  // eslint-disable-line

  const props = {
    date: formatDate(new Date),
    bookingIds: [ 'abc', 'def' ],
    component: AComponent,
  }


  it('renders with props', () => {
    const wrapper = shallow(<GroupedBookingsList {...props} />)
    expect(wrapper).to.exist
  })

  it('renders date grouping with `TODAY` if date is today', () => {
    const expected = `TODAY - ${formatDate(props.date, 'ddd MMM D').toUpperCase()}`
    const wrapper = shallow(<GroupedBookingsList {...props} />)

    expect(wrapper.find('h4').text()).to.equal(expected)
  })

  it('renders a message when there are no bookings to show', () => {
    const propsCopy = { ...props, bookingIds: [] }
    const wrapper = shallow(<GroupedBookingsList {...propsCopy} />)

    expect(wrapper.find('p')).to.exist
    expect(wrapper.find('p').text()).to.equal('No bookings to show')
  })
})
