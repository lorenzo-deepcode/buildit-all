import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Hour from '../../src/components/hour';

describe('Hour component', () => {

  const setup = date => {
    const component = shallow(<Hour date={date} />);
    return { 
      component
    , hour: component.find('.hour') 
    };
  };

  it('displays the hour correctly', () => {
    const { hour } = setup(new Date(2016, 6, 8, 10, 0));
    expect(hour.text()).to.equal('1000');
  });

  it('displays the 24 hour correctly', () => {
    const { hour } = setup(new Date(2016, 6, 8, 15, 30));
    expect(hour.text()).to.equal('1530');
  });

  it('displays the midnight correctly', () => {
    const { hour } = setup(new Date(2016, 6, 8, 0, 0));
    expect(hour.text()).to.equal('0000');
  });

  it('displays the midday correctly', () => {
    const { hour } = setup(new Date(2016, 6, 8, 12, 0));
    expect(hour.text()).to.equal('1200');
  });

});