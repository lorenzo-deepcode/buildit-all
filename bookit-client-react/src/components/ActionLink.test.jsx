import React from 'react'
import { shallow } from 'enzyme'

import ActionLink from 'Components/ActionLink'

describe('<ActionLink />', () => {
  it('renders a single `a` tag', () => {
    const wrapper = shallow(<ActionLink onClick={() => {}} />)

    expect(wrapper).to.exist
    expect(wrapper.find('a')).to.have.lengthOf(1)
  })

  it('prevents user from overriding `href`', () => {
    const href = '/foo/bar'
    const wrapper = shallow(<ActionLink onClick={() => {}} href={href} />)

    expect(wrapper.find('a').prop('href')).to.equal('#')
    expect(wrapper.find('a').prop('href')).to.not.equal(href)
  })

  it('calls the provided `onClick` handler when clicked', () => {
    const onClick = jest.fn()
    const wrapper = shallow(<ActionLink onClick={onClick} />)

    wrapper.find('a').simulate('click',  { preventDefault: () => undefined })

    expect(onClick.mock.calls).to.have.lengthOf(1)
  })
})
