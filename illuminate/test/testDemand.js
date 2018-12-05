'use strict'

const constants = require('../util/constants');
const myDemand = require('../services/demand');
const Should = require('should');
const testConstants = require('./testConstants');
const utils = require('../util/utils');

const Config = require('config');
const Log4js = require('log4js');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

const GOODPROJECT = 'CIT';
const GOODSOURCE = 'Jira';

const DEMANDINFO = {
  source: GOODSOURCE,
  url: "https://digitalrig.atlassian.net/rest/api/latest/",
  project: GOODPROJECT,
  authPolicy: 'Basic',
  userData: 'ZGlnaXRhbHJpZzpEMWchdGFsUmln',
  flow: [{name: 'Backlog'}]};

const COMMONDEMAND = [
  { _id: '18020',
    uri: 'https://digitalrig.atlassian.net/rest/api/latest/issue/18020',
      history:[
        {statusValue: 'Backlog', startDate: '2016-05-20T09:19:51.000-0600', changeDate: '2016-05-20T14:18:35.251-0600'},
        {statusValue: 'Selected for development', startDate: '2016-05-20T14:18:35.251-0600', changeDate: '2016-05-26T07:20:52.350-0600'},
        {statusValue: 'Backlog', startDate: '2016-05-26T07:20:52.350-0600', changeDate: '2016-05-28T13:53:21.498-0600'},
        {statusValue: 'Selected for development', startDate: '2016-05-28T13:53:21.498-0600', changeDate: '2016-05-28T13:53:24.787-0600'},
        {statusValue: 'In Progress', startDate: '2016-05-28T13:53:24.787-0600', changeDate: '2016-06-04T13:06:55.686-0600'},
        {statusValue: 'Done', startDate: '2016-06-04T13:06:55.686-0600', changeDate: '2016-06-04T13:07:07.540-0600'},
        {statusValue: 'In Progress', startDate: '2016-06-04T13:07:07.540-0600', changeDate: '2016-06-09T07:49:44.193-0700'},
        {statusValue: 'Done', startDate: '2016-06-09T07:49:44.193-0700', changeDate: '2016-06-12T15:09:30.696-0700'},
        {statusValue: 'Fix Version-1.5', startDate: '2016-06-12T15:09:30.696-0700', changeDate: null} ]
  }];

const SUMMARYDEMAND = [
  { projectDate: '2016-05-20', status: { 'Selected for development': 1 } },
  { projectDate: '2016-05-21', status: { 'Selected for development': 1 } },
  { projectDate: '2016-05-22', status: { 'Selected for development': 1 } },
  { projectDate: '2016-05-23', status: { 'Selected for development': 1 } },
  { projectDate: '2016-05-24', status: { 'Selected for development': 1 } },
  { projectDate: '2016-05-25', status: { 'Selected for development': 1 } },
  { projectDate: '2016-05-26', status: { 'Backlog': 1 } },
  { projectDate: '2016-05-27', status: { 'Backlog': 1 } },
  { projectDate: '2016-05-28', status: { 'In Progress': 1 } },
  { projectDate: '2016-05-29', status: { 'In Progress': 1 } },
  { projectDate: '2016-05-30', status: { 'In Progress': 1 } },
  { projectDate: '2016-05-31', status: { 'In Progress': 1 } },
  { projectDate: '2016-06-01', status: { 'In Progress': 1 } },
  { projectDate: '2016-06-02', status: { 'In Progress': 1 } },
  { projectDate: '2016-06-03', status: { 'In Progress': 1 } },
  { projectDate: '2016-06-04', status: { 'In Progress': 1 } },
  { projectDate: '2016-06-05', status: { 'In Progress': 1 } },
  { projectDate: '2016-06-06', status: { 'In Progress': 1 } },
  { projectDate: '2016-06-07', status: { 'In Progress': 1 } },
  { projectDate: '2016-06-08', status: { 'In Progress': 1 } },
  { projectDate: '2016-06-09', status: { 'Done': 1 } },
  { projectDate: '2016-06-10', status: { 'Done': 1 } },
  { projectDate: '2016-06-11', status: { 'Done': 1 } }
];
 
describe('test/testDemand - configure Processing info', function() {
  var originalInfo = null;

  before('setup', function() {
    originalInfo = new utils.ProcessingInfo(utils.dbProjectPath(testConstants.UNITTESTPROJECT));
    originalInfo.rawLocation = constants.RAWEFFORT;
    originalInfo.commonLocation = constants.COMMONDEMAND;
    originalInfo.summaryLocation = constants.SUMMARYDEMAND;
    originalInfo.eventSection = constants.DEMANDSECTION;
    originalInfo.storageFunction = myDemand.rawDataProcessor;
  });

  it('Call effort function - should not effect the original object', function() {
    var effortInfo = myDemand.configureProcessingInstructions(originalInfo);

    Should(effortInfo).not.deepEqual(originalInfo);
    Should(effortInfo.rawLocation).equal(constants.RAWDEMAND);  // make sure things get set
    Should(effortInfo.storageFunction).equal(myDemand.rawDataProcessor); // make sure we don't slam the db function
  });
});

describe('test/testDemand - determine effort processing system', function() {
  it('Should decode Harvest', function() {
    var systemClass = myDemand.rawDataProcessor(DEMANDINFO);
    Should(systemClass).not.equal(null);
  });

  it('Should NOT decode not Harvest', function() {
    var badEffort = JSON.parse(JSON.stringify(DEMANDINFO));
    badEffort.source = GOODSOURCE + 'BADMAN';
    var systemClass = myDemand.rawDataProcessor(badEffort);
    Should(systemClass).equal(null);
  });
});

describe('test/testDemand - convert common to summary', function() {
  var processingInstructions = {};

  before('set up', function() {
    processingInstructions = new utils.ProcessingInfo(utils.dbProjectPath(testConstants.UNITTESTPROJECT));
    processingInstructions.endDate = '2016-03-24';
  });

  it('Should translate', function() {
    var summaryData = myDemand.transformCommonToSummary(COMMONDEMAND, processingInstructions);

    logger.debug('*****');
    logger.debug('summaryData');
    logger.debug(summaryData);
    logger.debug('*****');

    Should(summaryData).deepEqual(SUMMARYDEMAND);
  });
});
