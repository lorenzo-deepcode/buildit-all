import React from 'react'
import { mount } from 'enzyme'

import { MemoryRouter } from 'react-router'

import TransitionSwitch from 'Components/TransitionSwitch'

describe('<TransitionSwitch />', () => {
  const props = {
    transitionGroupClassName: 'some-container-classname',
  }

  it('renders with default props', () => {
    const wrapper = mount(<MemoryRouter><TransitionSwitch /></MemoryRouter>)

    expect(wrapper).to.exist
    expect(wrapper.find('TransitionGroup').prop('className')).to.equal(TransitionSwitch.defaultProps.transitionGroupClassName)
  })

  it('renders with a specific className prop', () => {
    const wrapper = mount(<MemoryRouter><TransitionSwitch {...props} /></MemoryRouter>)

    expect(wrapper.find('TransitionGroup').prop('className')).to.equal(props.transitionGroupClassName)
  })
})
