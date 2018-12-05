import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { mount } from 'enzyme';

import Weather from '../../src/components/weather';

const mockStore = configureStore();

describe('Weather component', () => {

  const setup = () => {
    return mount(
      <Provider store={mockStore({ forecast: { dates: [], forecasts: [] }})}>
        <Weather />
      </Provider>
    );
  };

  it('mounts the weather component', () => {
    expect(setup());
  });
});