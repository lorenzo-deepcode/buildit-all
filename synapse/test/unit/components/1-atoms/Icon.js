import React from 'react';
import Icon from 'components/1-atoms/Icon';
import { shallow } from 'enzyme';
import { expect } from 'chai';

describe('<Icon />', () => {
  function onClick() { return true; }
  const icon = 'test';
  const wrapper = shallow(<Icon icon={icon} onClick={onClick} />);

  it('sets the icon class properly', () => {
    expect(wrapper.hasClass(icon)).to.equal(true);
  });

  it('sets the click handler properly', () => {
    expect(wrapper.prop('onClick')).to.equal(onClick);
  });
});
