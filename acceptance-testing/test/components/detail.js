import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Detail from '../../src/components/detail';
import { Hour, Description, Temperature, Wind, Atmosphere } from '../../src/components';

describe('Detail component', () => {

  const setup = forecast => {
    const component = shallow(<Detail forecast={forecast} />);
    return { 
      component
    , detail: component.find('.detail')
    };
  };

  it('displays the detail correctly', () => {
    const { detail } = setup({ 
      date: new Date(2016, 10, 10)
    , description: 'Rain'
    , maximumTemperature: 20 
    , minimumTemperature: 10 
    , windSpeed: 20
    , windDirection: 359
    , rainfall: 0
    , pressure: 1000 
    });

    expect(detail).to.exist;
    expect(detail).to.have.descendants(Hour);
    expect(detail).to.have.descendants(Description);
    expect(detail).to.have.descendants(Temperature);
    expect(detail).to.have.descendants(Wind);
    expect(detail).to.have.descendants(Atmosphere);
  });

});