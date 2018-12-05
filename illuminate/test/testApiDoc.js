'use strict'

const apiDocs = require('../services/swaggerDoc');
const HttpMocks = require('node-mocks-http');
const Should = require('should');

function buildResponse() {
  return HttpMocks.createResponse({eventEmitter: require('events').EventEmitter})
}

describe('Swagger Doc Controller Tests', function() {

  it('Test Doc Not Found', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      method: 'GET',
      url: '/v0/doc'
    });

    response.on('end', function() {
      Should(response._getData()).equal('Unable to find api doc.');
      done();
    });

    apiDocs.serveDoc(request, response);
  });

  it('Test Serve API Doc', function(done) {
    var response = buildResponse();
    var request  = HttpMocks.createRequest({
      method: 'GET',
      url: '/v1/doc'
    });

    response.on('end', function() {
      Should(response._getData()).not.equal('Unable to find api doc.');
      done();
    });

    apiDocs.serveDoc(request, response);
  });
});
