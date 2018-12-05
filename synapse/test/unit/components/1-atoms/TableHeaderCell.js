import React from 'react';
import TableHeaderCell from 'components/1-atoms/TableHeaderCell';
import { shallow } from 'enzyme';
import { expect } from 'chai';

describe('<TableHeaderCell />', () => {
  const headerValue = 'test 1';
  const id = 'test-2';
  const wrapper = shallow(<TableHeaderCell headerValue={headerValue} id={id} />);

  it('puts the text in properly', () => {
    expect(wrapper.text()).to.equal(headerValue);
  });

  it('sets the id', () => {
    expect(wrapper.is(`#${id}`)).to.equal(true);
  });
});
