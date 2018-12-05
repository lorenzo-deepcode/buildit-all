import React from 'react'
import { shallow } from 'enzyme'

import BookingFormContainer from './BookingFormContainer'
import BookingForm from 'Containers/BookingForm'

describe('<BookingFormContainer />', () => {
  it('has a single <BookingForm /> component', () => {
    const wrapper = shallow(<BookingFormContainer />)
    expect(wrapper.find(BookingForm)).to.exist
  })
})
