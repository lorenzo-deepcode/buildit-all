import React from 'react'
import { shallow } from 'enzyme'

import SlideUp from 'Components/SlideUp'

describe('<SlideUp />', () => {
  const AComponent = () => <div>Hello</div>

  it('renders', () => {
    const wrapper = shallow(<SlideUp in={true}>
      <AComponent />
    </SlideUp>)

    expect(wrapper).to.exist
    expect(wrapper.find('AComponent')).to.have.lengthOf(1)
  })
})
