import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Cell from '../../src/components/cell';

describe('Cell component', () => {

  const setup = props => {
    const component = shallow(<Cell {...props}><div /></Cell>);
    return { 
      component
    , children: component.children()
    , style: component.find('.cell').props().style
    };
  };

  it('renders children', () => {
    const { children } = setup();
    expect(children).to.exist;
  });

  it('renders default styles', () => {
    const { style } = setup();
    expect(style).to.deep.equal({
      float: 'left'
    , textAlign: 'left'
    , width: '20%'
    });
  });

  it('overrides alignment correctly', () => {
    const { style } = setup({ align: 'center' });
    expect(style.textAlign).to.equal('center');
  });

  it('overrides width correctly', () => {
    const { style } = setup({ width: 30 });
    expect(style.width).to.equal('30%');
  });

  it('overrides styles correctly', () => {
    const { style } = setup({ style: {width: '30%', color: 'red'} });
    expect(style).to.deep.equal({
      float: 'left'
    , textAlign: 'left'
    , width: '30%'
    , color: 'red'
    });
  });

});