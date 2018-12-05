import React from 'react';
import Radium from 'radium';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Wind from '../../src/components/wind';
import { Arrow } from '../../src/components/icon';

describe('Wind component', () => {

  const setup = (speed, direction, units) => {
    const component = shallow(<Wind speed={speed} direction={direction} units={units} />);
    return { 
      component
    , speed: component.find('.speed') 
    , direction: component.find('.direction') 
    };
  };

  before(() => Radium.TestMode.enable());
  after(() => Radium.TestMode.disable());

  it('displays the speed correctly', () => {
    const { speed } = setup(25, 0, 'kph');
    expect(speed.text()).to.equal('25kph');
  });

  it('displays the speed correctly when no units are specified', () => {
    const { speed } = setup(25, 0);
    expect(speed.text()).to.equal('25kph');
  });

  it('displays the speed correctly when alternate units are specified', () => {
    const { speed } = setup(30, 0, 'mph');
    expect(speed.text()).to.equal('30mph');
  });

  it('displays the direction arrow', () => {
    const { component } = setup(25, 0);
    expect(component).to.have.descendants(Arrow);
  });

});