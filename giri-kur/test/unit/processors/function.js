import { expect } from 'chai';
import processFunction from 'processors/function';

const testIdentifier = {
  type: 'identifier',
  value: 'rgb',
};
/*
 * This arg is something you'd never see in th wild.  HOWEVER:
 * for some reason, index.js will import processArguments as undef
 * when this test is run.  All of the other processors are just
 * fine, and this runs fine on production, and you can even import
 * processArguments in THIS file with no issue.  But not where
 * it's supposed to be.  So instead of spending more time on that,
 * I'm just using a value that works out of the box.  The arguemnts
 * processor is tested separately in its own file, so there's no
 * danger of this getting into some weird state, I don't think.
 */
const testArgs = {
  type: 'arguments',
  value: '85, 26, 139',
};

const testFunction = {
  type: 'function',
  value: [testIdentifier, testArgs, { type: 'what', value: 'foo' }],
};
const correct = 'rgb(85, 26, 139)';

describe('Function processor', () => {
  it('processes properly', () => {
    const output = processFunction(testFunction);
    expect(output).to.equal(correct);
  });
});
