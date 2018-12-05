import React from 'react';
import DateInput from 'components/1-atoms/DateInput';
import { shallow } from 'enzyme';
import { expect } from 'chai';

describe('<DateInput />', () => {
  function onInputChange() { return true; }
  const label = 'test';
  const initialValue = 'foo';

  const wrapper = shallow(
    <DateInput
      label={label}
      initialValue={initialValue}
      onInputChange={onInputChange}
    />);

  it('puts the label text in properly', () => {
    expect(wrapper.find('label').text()).to.equal(label);
  });

  const input = wrapper.find('input');
  it('uses the label text as a placeholder', () => {
    expect(input.prop('placeholder')).to.equal(label);
  });

  it('starts with the correct initial value', () => {
    expect(input.prop('value')).to.equal(initialValue);
  });

  // TODO: figure out a decent way of handling onChange function comparison.
});
