import React from 'react';
import { expect } from 'chai';
import TestUtils from 'react-addons-test-utils';
import { shallow } from 'enzyme';

import Icon, { DEFAULT_SIZE, DEFAULT_COLOUR } from '../../../src/components/icon/icon';

global.navigator = { userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2454.85 Safari/537.36' };

const createIcon = props => {
  return Icon(props)(_ => <path className='path' />);
};

const setup = (Component, props) => {
  const component = shallow(<Component {...props} />);

  return { 
    component
  , type: component.type()
  , props: component.props()
  , children: component.children()
  };
};

describe('Icon decorator', () => {

  describe('when default properties are supplied', () => {
    let result;

    before(() => result = setup(createIcon()));

    it('should render svg', () => {
      expect(result.type).to.equal('svg');
    });

    it('should render children', () => {
      expect(result.children).to.exist;
    });

    it('should set height and width to zero', () => {
      expect(result.props.height).to.equal(0);
      expect(result.props.width).to.equal(0);
    });

    it('should set default height and width in style', () => {
      expect(result.props.style.width).to.equal(DEFAULT_SIZE);
      expect(result.props.style.height).to.equal(DEFAULT_SIZE);
    });

    it('should set viewbox', () => {
      expect(result.props.viewBox).to.equal(`0 0 ${DEFAULT_SIZE} ${DEFAULT_SIZE}`);
    });

    it('should set default color', () => {
      expect(result.props.style.fill).to.equal(DEFAULT_COLOUR);
    });

  });

  describe('when setting default size', () => {
    let result;

    before(() => result = setup(createIcon({ defaultSize: 32 })));

    it('should render svg', () => {
      expect(result.type).to.equal('svg');
    });

    it('should set height and width to zero', () => {
      expect(result.props.height).to.equal(0);
      expect(result.props.width).to.equal(0);
    });

    it('should set default height and width in style', () => {
      expect(result.props.style.width).to.equal(32);
      expect(result.props.style.height).to.equal(32);
    });

    it('should set viewbox', () => {
      expect(result.props.viewBox).to.equal(`0 0 ${DEFAULT_SIZE} ${DEFAULT_SIZE}`);
    });

  });

  describe('when overriding default size', () => {
    let result;

    before(() => result = setup(createIcon({ defaultSize: 32 }), { size: 48 }));

    it('should render svg', () => {
      expect(result.type).to.equal('svg');
    });

    it('should set height and width to zero', () => {
      expect(result.props.height).to.equal(0);
      expect(result.props.width).to.equal(0);
    });

    it('should set default height and width in style', () => {
      expect(result.props.style.width).to.equal(48);
      expect(result.props.style.height).to.equal(48);
    });

    it('should set viewbox', () => {
      expect(result.props.viewBox).to.equal(`0 0 ${DEFAULT_SIZE} ${DEFAULT_SIZE}`);
    });

  });

  describe('when overriding default width', () => {
    let result;

    before(() => result = setup(createIcon({ defaultWidth: 16 }), { width: 18 }));

    it('should render svg', () => {
      expect(result.type).to.equal('svg');
    });

    it('should set height and width to zero', () => {
      expect(result.props.width).to.equal(0);
    });

    it('should set default height and width in style', () => {
      expect(result.props.style.width).to.equal(18);
    });

    it('should set viewbox', () => {
      expect(result.props.viewBox).to.equal(`0 0 ${DEFAULT_SIZE} ${DEFAULT_SIZE}`);
    });

  });

  describe('when overriding default height', () => {
    let result;

    before(() => result = setup(createIcon({ defaultHeight: 16 }), { height: 18 }));

    it('should render svg', () => {
      expect(result.type).to.equal('svg');
    });

    it('should set height and width to zero', () => {
      expect(result.props.height).to.equal(0);
    });

    it('should set default height and width in style', () => {
      expect(result.props.style.height).to.equal(18);
    });

    it('should set viewbox', () => {
      expect(result.props.viewBox).to.equal(`0 0 ${DEFAULT_SIZE} ${DEFAULT_SIZE}`);
    });

  });

  describe('when overriding default size with height', () => {
    let result;

    before(() => result = setup(createIcon({ defaultSize: 16 }), { height: 18 }));

    it('should render svg', () => {
      expect(result.type).to.equal('svg');
    });

    it('should set height and width to zero', () => {
      expect(result.props.width).to.equal(0);
      expect(result.props.height).to.equal(0);
    });

    it('should set default height and width in style', () => {
      expect(result.props.style.width).to.equal(16);
      expect(result.props.style.height).to.equal(18);
    });

    it('should set viewbox', () => {
      expect(result.props.viewBox).to.equal(`0 0 ${DEFAULT_SIZE} ${DEFAULT_SIZE}`);
    });

  });

  describe('when overriding default size with width', () => {
    let result;

    before(() => result = setup(createIcon({ defaultSize: 16 }), { width: 18 }));

    it('should render svg', () => {
      expect(result.type).to.equal('svg');
    });

    it('should set height and width to zero', () => {
      expect(result.props.width).to.equal(0);
      expect(result.props.height).to.equal(0);
    });

    it('should set default height and width in style', () => {
      expect(result.props.style.width).to.equal(18);
      expect(result.props.style.height).to.equal(16);
    });

    it('should set viewbox', () => {
      expect(result.props.viewBox).to.equal(`0 0 ${DEFAULT_SIZE} ${DEFAULT_SIZE}`);
    });

  });

  describe('when setting default color', () => {
    let result;

    before(() => result = setup(createIcon({ defaultColour: '#000' })));

    it('should render svg', () => {
      expect(result.type).to.equal('svg');
    });

    it('should set colour', () => {
      expect(result.props.style.fill).to.equal('#000');
    });

  });

  describe('when overridding default color', () => {
    let result;

    before(() => result = setup(createIcon({ defaultColour: '#000' }), { colour: '#ccc' }));

    it('should render svg', () => {
      expect(result.type).to.equal('svg');
    });

    it('should set colour', () => {
      expect(result.props.style.fill).to.equal('#ccc');
    });

  });

  describe('when overriding default colour', () => {
    let result;

    before(() => result = setup(createIcon(), { colour: '#000' }));

    it('should render svg', () => {
      expect(result.type).to.equal('svg');
    });

    it('should set overridden color', () => {
      expect(result.props.style.fill).to.equal('#000');
    });

  });

  describe('when overriding default size', () => {
    let result;

    before(() => result = setup(createIcon(), { size: 24 }));

    it('should render svg', () => {
      expect(result.type).to.equal('svg');
    });

    it('should set height and width to zero', () => {
      expect(result.props.height).to.equal(0);
      expect(result.props.width).to.equal(0);
    });

    it('should set height and width in style', () => {
      expect(result.props.style.width).to.equal(24);
      expect(result.props.style.height).to.equal(24);
    });

    it('should set default viewbox', () => {
      expect(result.props.viewBox).to.equal(`0 0 ${DEFAULT_SIZE} ${DEFAULT_SIZE}`);
    });

  });

  describe('when overriding default width and height', () => {
    let result;

    before(() => result = setup(createIcon(), { width: 12, height: 16 }));

    it('should render svg', () => {
      expect(result.type).to.equal('svg');
    });

    it('should set height and width to zero', () => {
      expect(result.props.height).to.equal(0);
      expect(result.props.width).to.equal(0);
    });

    it('should set height and width in style', () => {
      expect(result.props.style.width).to.equal(12);
      expect(result.props.style.height).to.equal(16);
    });

    it('should set default viewbox', () => {
      expect(result.props.viewBox).to.equal(`0 0 ${DEFAULT_SIZE} ${DEFAULT_SIZE}`);
    });

  });

  describe('when setting label', () => {
    let result;

    before(() => result = setup(createIcon(), { label: 'Label' }));

    it('should set aria-label', () => {
      expect(result.props['aria-label']).to.equal('Label');
    });
  });
});
