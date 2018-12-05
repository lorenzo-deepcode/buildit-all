import React from 'react'
import { shallow } from 'enzyme'

import Button from 'Components/Button'

describe('<Button />', () => {
  it('renders a button', () => {
    const wrapper = shallow(<Button />)

    expect(wrapper.find('button')).to.have.tagName('button').and.to.be.empty
  })

  it('adds classNames passed from props', () => {
    const classNames = 'button button--active'
    const wrapper = shallow(<Button className={classNames} />)

    expect(wrapper.find('button')).to.have.className('button').and.to.have.className('button--active')
  })

  it('lets you specify the content of the button', () => {
    const content = 'A FANCY BUTTON'
    const wrapper = shallow(<Button>{ content }</Button>)

    expect(wrapper.find('button')).to.have.text(content)
  })

  it('lets you pass an onClick handler', () => {
    const mockClick = jest.fn()
    const wrapper = shallow(<Button onClick={mockClick} />)

    wrapper.find('button').simulate('click')
    expect(mockClick.mock.calls.length).to.equal(1)
  })

  it('passes html attributes as props', () => {
    expect(shallow(<Button disabled />).find('button')).to.be.disabled
  })

  it('restricts `type` to `button` or `submit`', () => {
    expect(() => (<Button type="lemons" />)).to.throw()
  })
})
