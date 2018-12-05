import React from 'react'
import { shallow } from 'enzyme'

import Login from './Login'
import Button from 'Components/Button'

describe('<Login />', () => {
  it('renders itself with a <Button /> component', () => {
    const wrapper = shallow(<Login />)
    expect(wrapper.find(Button)).to.exist
  })
})
