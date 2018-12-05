import React from 'react'
import { shallow } from 'enzyme'

import Loading from 'Components/Loading'

describe('<Loading />', () => {
  it('renders', () => {
    const wrapper = shallow(<Loading />)

    expect(wrapper).to.exist
    expect(wrapper.find('div')).to.have.lengthOf(2)
  })
})
