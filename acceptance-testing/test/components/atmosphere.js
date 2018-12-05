import React from 'react';
import Radium from 'radium';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Atmosphere from '../../src/components/atmosphere';

describe('Atmosphere component', () => {

  const setup = (rainfall, pressure) => {
    const component = shallow(<Atmosphere rainfall={rainfall} pressure={pressure} />);
    return { 
      component
    , rainfall: component.find('.rainfall') 
    , pressure: component.find('.pressure') 
    };
  };

  before(() => Radium.TestMode.enable());
  after(() => Radium.TestMode.disable());

  it('displays the rainfall correctly', () => {
    const { rainfall } = setup(0, 1000);
    expect(rainfall.text()).to.contain('0mm');
  });

  it('displays the pressure correctly', () => {
    const { pressure } = setup(0, 1000);
    expect(pressure.text()).to.contain('1000mb');
  });

});