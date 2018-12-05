import React from 'react'
import { shallow } from 'enzyme'

import Button from 'Components/Button'

import { BookingForm } from 'Containers/BookingForm'

// TODO: See BKIT-199 w/regards to clunky/ineffective tests

describe('<BookingForm />', () => {
  const props = {
    createBooking: jest.fn(),
    handleSubmit: jest.fn(fn => values => console.log('VALUES:', values)),  // eslint-disable-line
    initialize: jest.fn(),
    locations: [
      { id: 'id1', name: 'NYC' },
      { id: 'id2', name: 'LON' },
    ],
    getBookablesForLocation: jest.fn(),
    getAllLocations: jest.fn(),
  }

  beforeEach(() => {
    props.handleSubmit.mockClear()
    props.getAllLocations.mockClear()
  })

  it('renders itself and <Button /> given the default props', () => {
    const wrapper = shallow(<BookingForm { ...props } />)

    expect(wrapper.find(Button).find('button')).to.not.be.disabled
  })

  it('calls handleSubmit on click', () => {
    const wrapper = shallow(<BookingForm { ...props } />, { disableLifecycleMethods: true })

    wrapper.find('Button').shallow().find('button').simulate('click')

    expect(props.handleSubmit.mock.calls.length).to.equal(1)
  })

  it('[BKIT-91] renders <Loading> when `locations` is empty', () => {
    const { locations, ...newProps } = props  // eslint-disable-line
    const wrapper = shallow(<BookingForm { ...newProps } />, { disableLifecycleMethods: true })

    expect(wrapper.find('Loading').length).to.equal(1)
  })

  it('[BKIT-91] safely continues to render and dispatch if locations prop is not passed at all', () => {
    const { locations, ...newProps } = props  // eslint-disable-line

    expect(() => (shallow(<BookingForm { ...newProps } />))).to.not.throw()
  })

  it('[BKIT-91] calls `this.props.getAllLocations` if locations are not passed as props', () => {
    const { locations, ...newProps } = props  // eslint-disable-line
    shallow(<BookingForm { ...newProps } />)

    expect(newProps.getAllLocations.mock.calls.length).to.equal(1)
  })

})
