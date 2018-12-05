import React from 'react';
import RouteLink from 'components/1-atoms/RouteLink';
import { Link } from 'react-router';
import { mount } from 'enzyme';
import { expect } from 'chai';
import 'jsdom-global/register';

describe('<RouteLink />', () => {
  const testUrl = 'test-2016-09-22-03:33:41';
  const testUrlCorrect = encodeURIComponent(testUrl);
  const label = 'test';

  const wrapper = mount(<RouteLink route={testUrl} label={label} />);

  it('contains a wrapper with a class of route-link', () => {
    expect(wrapper.find('.route-link').length).to.equal(1);
  });
  it('contains a Link as a child of the route-link wrapper', () => {
    expect(wrapper.find('.route-link').find(Link).length).to.equal(1);
  });

  it('encodes urls properly', () => {
    const link = wrapper.find(Link);
    expect(link.prop('to')).to.equal(testUrlCorrect);
  });

  it('doesn\'t encode slashes in the url', () => {
    const slashUrl = `${testUrl}/foo`;
    const slashUrlCorrect = `${testUrlCorrect}/foo`;
    wrapper.setProps({ route: slashUrl });

    expect(wrapper.find(Link).prop('to')).to.equal(slashUrlCorrect);
  });
});
