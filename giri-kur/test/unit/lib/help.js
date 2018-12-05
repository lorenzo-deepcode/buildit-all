import { processorHelp, brandaiHelp } from 'lib/help';

import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';

chai.use(sinonChai);

describe('Help Messager', () => {
  it('should console log a processorHelp message properly', () => {
    const consoleStub = sinon.stub(console, 'log');
    processorHelp();
    console.log.restore(); // eslint-disable-line no-console

    expect(consoleStub).to.have.been.called;
  });
});

describe('BrandAi Help Messager', () => {
  it('should console log a brandaiHelp message properly', () => {
    const consoleStub = sinon.stub(console, 'log');
    brandaiHelp();
    console.log.restore(); // eslint-disable-line no-console

    expect(consoleStub).to.have.been.called;
  });
});
