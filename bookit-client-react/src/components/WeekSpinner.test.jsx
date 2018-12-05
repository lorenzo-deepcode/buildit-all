import React from 'react'
import { shallow } from 'enzyme'

import WeekSpinner from 'Components/WeekSpinner'

describe('<WeekSpinner />', () => {
  const props = {
    onClick: jest.fn(),
    weekOf: '2017-11-17',
  }

  beforeEach(() => {
    props.onClick.mockReset()
  })

  it('goes to the next week when the next arrow is clicked', () => {
    const expected = '2017-11-24'
    const wrapper = shallow(<WeekSpinner {...props} />)

    wrapper.find('ActionLink').last().simulate('click')

    expect(props.onClick.mock.calls).to.have.lengthOf(1)
    expect(props.onClick.mock.calls[0][0]).to.equal(expected)
  })

  it('goes to the previous week when the previous arrow is clicked', () => {
    const expected = '2017-11-10'
    const wrapper = shallow(<WeekSpinner {...props} />)

    wrapper.find('ActionLink').first().simulate('click')

    expect(props.onClick.mock.calls).to.have.lengthOf(1)
    expect(props.onClick.mock.calls[0][0]).to.equal(expected)
  })
})
