import React from 'react'
import { mount } from 'enzyme'

import { BookablesList } from 'Containers/BookablesList'

describe('<BookablesList />', () => {
  it('renders a list of bookables on the page', async () => {
    const setBookablesVisible = jest.fn()
    const getAvailability = jest.fn()
    const change = jest.fn()

    getAvailability.mockReturnValue(Promise.resolve({
      payload: [
        { bookableId: 'xyz', name: 'Mock Room One', closed: false, reason: '' },
        { bookableId: 'abc', name: 'Mock Room Two', closed: true, reason: 'Eggs Everywhere, man' },
      ],
    }))

    const wrapper = mount(
      <BookablesList
        dates={{
          start: '2017-12-15T00:30:00',
          end: '2017-12-15T01:00:00',
        }}
        location='xyz'
        change={change}
        getAvailability={getAvailability}
        setBookablesVisible={setBookablesVisible}
      />
    )

    await wrapper.instance().componentDidMount()

    expect(wrapper.find('BookableAvailabilityItem')).to.have.length(0)
    wrapper.update()
    expect(wrapper.find('BookableAvailabilityItem')).to.have.length(2)
  })
})
