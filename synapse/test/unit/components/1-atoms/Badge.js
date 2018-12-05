import React from 'react';
import Badge from 'components/1-atoms/Badge';
import { shallow } from 'enzyme';
import { expect } from 'chai';

describe('<Badge />', () => {
  const label = 'test';

  const wrapper = shallow(<Badge label={label} />);

  it('puts the label text in properly', () => {
    expect(wrapper.text()).to.equal(label);
  });
});
