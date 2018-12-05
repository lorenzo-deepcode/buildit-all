import React from 'react'
import PropTypes from 'prop-types'

import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'

import { mount } from 'enzyme'

import withBookable from 'Hoc/with-bookable'

const mockStore = configureMockStore()

jest.mock('Redux', () => ({
  selectors: {
    isBookableClosed: jest.fn().mockReturnValue(true),
    getBookableDispositionReason: jest.fn().mockReturnValue('giant rats'),
    getBookableName: jest.fn().mockReturnValue('A Bookable'),
  },
}))

describe('with-bookable', () => {
  const AComponent = ({ id, closed, reason, name }) => (<div>{ id }:{ closed ? 'closed' : 'open' }:{ reason }:{ name }</div>)

  AComponent.propTypes = {
    id: PropTypes.string,
    closed: PropTypes.bool,
    reason: PropTypes.string,
    name: PropTypes.string,
  }

  const WrappedComponent = withBookable(AComponent)
  const id = 'abc'

  describe('#withBookable(WrappedComponent)', () => {
    it('connects a normal component to the redux store for bookable properties', () => {
      const wrapper = mount(<Provider store={mockStore()}><WrappedComponent id={id} /></Provider>)

      expect(wrapper.text()).to.equal('abc:closed:giant rats:A Bookable')
    })
  })
})
