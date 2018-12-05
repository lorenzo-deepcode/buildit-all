import React from 'react'
import { shallow } from 'enzyme'

import Iframe from 'Components/Iframe'

describe('<Iframe />', () => {
  const props = {
    iframeRef: jest.fn(),
  }

  it('renders with props', () => {
    const wrapper = shallow(<Iframe {...props} />)

    expect(wrapper).to.exist
  })
})
