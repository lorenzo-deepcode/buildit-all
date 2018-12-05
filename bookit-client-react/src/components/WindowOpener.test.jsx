import React from 'react'
import { mount } from 'enzyme'

import WindowOpener from 'Components/WindowOpener'

describe('<WindowOpener />', () => {
  const props = {
    onLoaded: jest.fn(),
  }

  const addMap = {}
  const removeMap = {}

  window.addEventListener = jest.fn((event, cb) => addMap[event] = cb)
  window.removeEventListener = jest.fn((event, cb) => removeMap[event] = cb)

  const openedWindow = { close: jest.fn() }

  beforeEach(() => {
    props.onLoaded.mockReset()
  })

  it('renders', () => {
    window.open = jest.fn().mockReturnValueOnce(openedWindow)

    const wrapper = mount(<WindowOpener { ...props } />)

    wrapper.instance().componentDidMount()

    expect(wrapper).to.exist
    expect(addMap['unload']).to.exist
    expect(removeMap['unload']).to.not.exist

    wrapper.unmount()

    expect(addMap['unload']).to.exist
    expect(removeMap['unload']).to.exist
  })

  it('does almost nothing when `openedWindow` fails', () => {
    window.open = jest.fn().mockReturnValueOnce(null)

    const wrapper = mount(<WindowOpener { ...props } />)

    wrapper.instance().componentDidMount()

    expect(wrapper).to.exist

    wrapper.unmount()
  })
})
