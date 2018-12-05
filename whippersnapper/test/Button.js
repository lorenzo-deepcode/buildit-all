import React from 'react';
import Button from '../build/Button.js';
import { shallow } from 'enzyme';
import { expect } from 'chai';

describe('<Button />', () => {
  function onClick() { return true; }
  const label = 'test';
  const className = 'foo';
  const disabled = true;

  const wrapper = shallow(
    <Button
      label={label}
      cssClasses={className}
      onClick={onClick}
      disabled={disabled}
    />);

  it('puts the button text in properly', () => {
    expect(wrapper.text()).to.equal(label);
  });

  it('sets the class properly', () => {
    expect(wrapper.hasClass(className)).to.equal(true);
  });

  it('sets the click handler properly', () => {
    expect(wrapper.prop('onClick')).to.equal(onClick);
  });

  it('sets itself disabled properly', () => {
    expect(wrapper.prop('disabled')).to.equal(disabled);
  });
});
