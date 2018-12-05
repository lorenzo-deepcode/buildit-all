import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Description from '../../src/components/description';

describe('Description component', () => {

  const setup = description => {
    const component = shallow(<Description description={description} />);
    return { 
      component
    , icon: component.find('.icon')
    , description: component.find('.description') 
    };
  };

  it('displays the icon', () => {
    const { icon } = setup('Rain');
    expect(icon).to.exist;
  });

  it.skip('displays the correct icon', () => {
    const { icon } = setup('Rain');
    expect(icon.children('.rain')).to.exist;
  });

});