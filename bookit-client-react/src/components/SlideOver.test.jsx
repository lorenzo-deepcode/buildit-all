import React from 'react'
import { shallow } from 'enzyme'

import SlideOver from 'Components/SlideOver'

describe('<SlideOver />', () => {
  const AComponent = () => <div>Hello</div>

  it('renders', () => {
    const wrapper = shallow(<SlideOver in={true}>
      <AComponent />
    </SlideOver>)

    expect(wrapper).to.exist
    expect(wrapper.find('AComponent')).to.have.lengthOf(1)
  })
})
