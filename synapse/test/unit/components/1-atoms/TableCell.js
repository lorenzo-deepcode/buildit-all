import React from 'react';
import TableCell from 'components/1-atoms/TableCell';
import { shallow } from 'enzyme';
import { expect } from 'chai';

describe('<TableCell />', () => {
  const cellValue = 'test 1';
  const id = 'test-2';
  const wrapper = shallow(<TableCell cellValue={cellValue} id={id} />);

  it('puts the text in properly', () => {
    expect(wrapper.text()).to.equal(cellValue);
  });

  it('sets the id', () => {
    expect(wrapper.is(`#${id}`)).to.equal(true);
  });
});
