import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Arrow } from '../../../src/components/icon';

describe('Arrow icon component', () => {

  const setup = () => {
    const component = mount(<Arrow />);

    return {
      component
    , path: component.find('.arrow')
    };
  };

  it('renders the arrow icon', () => {
    const result = setup();
    expect(result.path.type()).to.equal('g');
  });

});