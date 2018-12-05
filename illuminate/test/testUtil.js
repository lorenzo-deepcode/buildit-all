'use strict'

const Moment = require('moment');
const Should = require('should');
const utils = require('../util/utils');

const Config = require('config');
const Log4js = require('log4js');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

describe('#createDayArray() method', function() {

  it('test empty array', function() {
    var result = utils.createDayArray('2020-01-01', '2020-01-01');
    Should(result.length).equal(0);
  });

  it('test null start behavoir ', function() {
    var result = utils.createDayArray(null, '2020-01-01');
    Should(result.length).equal(0);
  });

  it('test null end behavoir', function() {
    var result = utils.createDayArray('2000-01-01', null);
    Should(result.length).equal(0);
  });

  it('test 1 day', function() {
    var result = utils.createDayArray('2020-01-01', '2020-01-02');
    Should(result.length).equal(1);
  });

  it('test leap year ', function() {
    var result = utils.createDayArray('2020-02-01', '2020-03-01');
    Should(result.length).equal(29);
  });

  it('test non-leap year ', function() {
    var result = utils.createDayArray('2021-02-01', '2021-03-01');
    Should(result.length).equal(28);
  });

  it('test expectedValue ', function() {
    var result = utils.createDayArray('2022-02-02', '2022-02-04');
    Should(result.length).equal(2);
    Should(result).deepEqual(['2022-02-02', '2022-02-03']);
  });

});

describe('#dateFormatIWant() method', function() {

  it('without tz info', function() {
    var result = utils.dateFormatIWant('2020-02-01');
    Should(result).equal('2020-02-01');
  });

  it('with TZ 0 info', function() {
    var result = utils.dateFormatIWant('2020-02-01T00:00:00.000Z');
    Should(result).equal('2020-02-01');
  });

  it('try filled out with milliseconds and offset', function() {
    var result = utils.dateFormatIWant('2016-03-22T02:59:01.278-0100');
    Should(result).equal('2016-03-22');
  });

  it('try filled out Zulu time', function() {
    var result = utils.dateFormatIWant('2016-03-15T17:00:48Z');
    Should(result).equal('2016-03-15');
  });

  it('try with empty string', function() {
    var result = utils.dateFormatIWant('');
    var today = utils.dateFormatIWant((new Date()).toJSON().toString());
    Should(result).equal(today);
  });

});

// some of this is questionable but make sure that
// the _id is a GUID
// endTime is null
// startTime is aValid timestamp (in string form)
describe('#DataEvent() class', function() {
  it('create an Event - make sure the startTime is a date value', function() {
    var result = new utils.DataEvent('TEST TYPE');
    logger.debug(result);
    Should(result._id.length).equal(36);
    Should(result._id).containEql('-');
    Should(result.endTime).be.null();
    Should(result.startTime).containEql('T');
    Should(result.startTime).containEql('Z');
    Should.ok(Moment(result.startTime).isValid);
  });
});
