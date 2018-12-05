/* eslint no-console: 0 */
import * as display from 'lib/display';

import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';

chai.use(sinonChai);

describe('Logger/Console display', () => {
  let consoleStub;

  beforeEach(() => {
    consoleStub = sinon.stub(console, 'log');
  });

  it('should not display or log or debug if nothing has been enabled', () => {
    display.display('foo');
    display.log('foo');
    display.debug('foo');
    console.log.restore(); // eslint-disable-line no-console
    expect(consoleStub).not.to.have.been.called;
  });
  it('should only display, not log or debug, if only display is enabled', () => {
    display.enableDisplay();
    display.display('foo');
    display.log('foo');
    display.debug('foo');
    display.disableDisplay();
    console.log.restore(); // eslint-disable-line no-console
    expect(consoleStub).to.have.been.calledOnce;
  });
  it('should only log, not display or debug, if only logging is enabled', () => {
    display.enableLog();
    display.display('foo');
    display.log('foo');
    display.debug('foo');
    display.disableLog();
    console.log.restore(); // eslint-disable-line no-console
    expect(consoleStub).to.have.been.calledOnce;
  });
  it('should only debug, not log or display, if only debugging is enabled', () => {
    display.enableDebug();
    display.display('foo');
    display.log('foo');
    display.debug('foo');
    display.disableDebug();
    console.log.restore(); // eslint-disable-line no-console
    expect(consoleStub).to.have.been.calledOnce;
  });
  it('should output a proper header when debug is called with one', () => {
    display.enableDebug();
    const correct = '\n\n\nFoo\n=========================\n\'foo\'\n=========================';
    display.debug('foo', 'Foo');
    display.disableDebug();
    console.log.restore(); // eslint-disable-line no-console
    expect(consoleStub).to.have.been.calledWith(correct);
  });
  it('should display and log and debug if all are enabled', () => {
    display.enableLog();
    display.enableDisplay();
    display.enableDebug();
    display.display('foo');
    display.log('foo');
    display.debug('foo');
    console.log.restore(); // eslint-disable-line no-console
    expect(consoleStub).to.have.been.calledThrice;
  });
});
