import React from 'react'
import PropTypes from 'prop-types'

import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'

import { mount } from 'enzyme'

import withBooking from 'Hoc/with-booking'

const mockStore = configureMockStore()

jest.mock('Redux', () => ({
  selectors: {
    getBookingSubject: jest.fn().mockReturnValue('A Subject'),
    getBookingStart: jest.fn().mockReturnValue('2017-12-19T01:00'),
    getBookingEnd: jest.fn().mockReturnValue('2017-12-19T02:00'),
    getBookingBookableName: jest.fn().mockReturnValue('Bookable Name'),
    getBookingLocationName: jest.fn().mockReturnValue('Location Name'),
  },
}))

describe('with-booking', () => {
  const AComponent = ({ id, subject, start, end, bookableName, locationName }) => (<div>{ id }:{ subject }:{ start }:{ end }:{ bookableName }:{ locationName }</div>)

  AComponent.propTypes = {
    id: PropTypes.string,
    subject: PropTypes.string,
    start: PropTypes.string,
    end: PropTypes.string,
    bookableName: PropTypes.string,
    locationName: PropTypes.string,
  }

  const WrappedComponent = withBooking(AComponent)
  const id = 'abc'

  describe('#withBooking(WrappedComponent)', () => {
    it('connects a normal component to the redux store for booking properties', () => {
      const wrapper = mount(<Provider store={mockStore()}><WrappedComponent id={id} /></Provider>)

      expect(wrapper.text()).to.equal('abc:A Subject:2017-12-19T01:00:2017-12-19T02:00:Bookable Name:Location Name')
    })
  })
})
