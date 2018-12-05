const Rest = require('./');
const Log4js = require('log4js');
const Config = require('config');
const Should = require('should');
const HttpStatus = require('http-status-codes');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

const httpFunctions = ['del', 'get', 'head', 'json', 'patch', 'patchJson', 'post', 'postJson', 'put', 'putJson'];

describe('restler-as-promise ->', () => {
  describe('methods exported as promises ->', () => {
    httpFunctions.forEach(methodName => {
      it(`exports Restler.${methodName} as a promise`, () => {
        Should(Rest[methodName]().catch(() => undefined)).be.instanceOf(Promise);
      });
    });
  });

  it('passes on error', () => {
    return Rest.get().catch(error => {
      Should(error.message.includes('url')).be.true();
    });
  });

  it('passes on fails', () => {
    return Rest.get('http://hopefully.this.site.never.exists').catch(error => {
      Should(error.data.code).equal('ENOTFOUND');
    });
  });

  it('passes on success', () => {
    return Rest.get('http://google.com').then(({ data, response}) => {
      Should(response.statusCode).equal(HttpStatus.OK)
      Should(data).be.a.String();
    });
  });
});
