import React from 'react'
import { mount } from 'enzyme'
import { Link } from 'react-router-dom'
import { MemoryRouter } from 'react-router'

import Landing from 'Containers/Landing'

describe('<Landing />', () => {
  it('renders itself with an a tag to the book page', () => {
    const wrapper = mount(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    )
    const link = wrapper.find(Link)
    expect(link).to.exist
    expect(link.find('a').first().prop('href')).to.equal('/book')
  })

  it('renders itself with an a tag to the bookings page', () => {
    const wrapper = mount(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    )
    const link = wrapper.find(Link)
    expect(link.find('a').last().prop('href')).to.equal('/bookings')
  })
})
