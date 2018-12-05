'use strict'

const about = require('../services/about');
const HttpMocks = require('node-mocks-http');
const Should = require('should');

const Config = require('config');
const Log4js = require('log4js');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

function buildResponse() {
  return HttpMocks.createResponse({eventEmitter: require('events').EventEmitter})
}

describe('About Controller Tests', function() {

  it('Test Ping', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      method: 'GET'
    });

    response.on('end', function() {
      var body = JSON.parse(response._getData());
      logger.debug('PING');
      logger.debug(body);
      Should(body).have.property('datastore');
      done();
    });

    about.ping(request, response);
  });

  it('Test DeepPing', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      method: 'GET'
    });

    response.on('end', function() {
      var body = JSON.parse(response._getData());
      logger.debug('DEEP PING');
      logger.debug(body);
      Should(body).have.property('DataStore');
      done();
    });

    about.deepPing(request, response);
  });
});
