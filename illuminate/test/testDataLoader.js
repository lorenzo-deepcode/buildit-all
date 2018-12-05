'use strict'

const constants = require('../util/constants');
const dataLoader = require('../services/dataLoader');
const demandLoader = require('../services/demand');
const effortLoader = require('../services/effort');
const myDatastore = require('../services/datastore/mongodb');
const illuminateSystems = require('@buildit/illuminate-systems');
const testClass = illuminateSystems.effort.harvest;
const testConstants = require('./testConstants');
const utils = require('../util/utils');
const event = require('../services/event');
const Should = require('should');
const Sinon = require('sinon');
require('sinon-as-promised');

const Config = require('config');
const Log4js = require('log4js');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

const ANEFFORTSYSTEM = {
  source: 'Harvest',
  url: 'https://builditglobal.harvestapp.com',
  project: 123456,
  authPolicy: 'Basic',
  userData: 'password',
  role: []};

const RAWDATA = [
  {
    _id: 439722386,
    day_entry:
    {
      task_name: "Delivery",
      id: 439722386,
      notes: "Sheffeld co-lo, planning",
      spent_at: "2015-10-21",
      hours: 8,
      user_id: 1239662,
      project_id: 10284278,
      task_id: 5715688,
      created_at: "2016-03-15T17:00:48Z",
      updated_at: "2016-03-15T17:00:48Z",
      adjustment_record: false,
      timer_started_at: null,
      is_closed: false,
      is_billed: false
    }
  },
  {
    _id: 439722390,
    day_entry:
    {
      task_name: "Delivery",
      id: 439722390,
      notes: "Sheffeld co-lo, planning",
      spent_at: "2015-10-22",
      hours: 8,
      user_id: 1239646,
      project_id: 10284278,
      task_id: 5715688,
      created_at: "2016-03-15T17:00:48Z",
      updated_at: "2016-03-15T17:00:48Z",
      adjustment_record: false,
      timer_started_at: null,
      is_closed: false,
      is_billed: false
    }
  }
];

const EXPECTEDCOMMONDATA = [
  {
    day: '2015-10-21',
    role: 'Delivery',
    effort: 8
  },
  {
    day: '2015-10-22',
    role: 'Delivery',
    effort: 8
  }
];

describe('testDataLoader', () => {

  describe('testDataLoader - Test Error - unknown demand system', function() {
    var dataEvent = {};
    var processingInfo = {};

    before('Setup', function() {
      processingInfo = new utils.ProcessingInfo(utils.dbProjectPath(testConstants.UNITTESTPROJECT));
      processingInfo.sourceSystem = null;
      dataEvent = new utils.DataEvent(constants.LOADEVENT);
    });

    it('trap wipe error', function() {
      return dataLoader.processProjectSystem(effortLoader, ANEFFORTSYSTEM, dataEvent, processingInfo)
      .then ( function(returnValue) {
        Should(returnValue.status).equal(constants.FAILEDEVENT);
      }).catch ( function() {
        Should.ok(false);
      });
    });
  });

  describe('testDataLoader - Test Error Getting Raw Data', function() {
    var dataEvent = {};
    var processingInfo = {};

    before('Setup', function() {
      dataEvent = new utils.DataEvent(constants.LOADEVENT);
      processingInfo = new utils.ProcessingInfo(utils.dbProjectPath(testConstants.UNITTESTPROJECT));
      processingInfo.sourceSystem = testClass;
      this.loadRawData = Sinon.stub(testClass, 'loadRawData').rejects('error');
    });

    after('Restore', function() {
      testClass.loadRawData.restore();
    });

    it('trap error', function() {
      return dataLoader.processProjectSystem(effortLoader, ANEFFORTSYSTEM, dataEvent, processingInfo)
      .then ( function(returnValue) {
        Should(returnValue).not.be.null;
        Should(returnValue.status).equal(constants.FAILEDEVENT);
      }).catch ( function() {
        Should.ok(false);
      });
    });
  });

  describe('testDataLoader - Test Getting 0 Raw Records', function() {
    var dataEvent = {};
    var processingInfo = {};

    before('Setup', function() {
      dataEvent = new utils.DataEvent(constants.LOADEVENT);
      processingInfo = new utils.ProcessingInfo(utils.dbProjectPath(testConstants.UNITTESTPROJECT));
      processingInfo.sourceSystem = testClass;
      this.loadRawData = Sinon.stub(testClass, 'loadRawData').resolves([]);
    });

    after('Restore', function() {
      testClass.loadRawData.restore();
    });

    it('trap empty result', function() {
      return dataLoader.processProjectSystem(effortLoader, ANEFFORTSYSTEM, dataEvent, processingInfo)
      .then ( function(returnValue) {
        Should(returnValue.status).equal(constants.SUCCESSEVENT);
      }).catch ( function() {
        Should.ok(false);
      });
    });
  });

  describe('testDataLoader - Test Error Reading Raw Data', function() {
    var dataEvent = {};
    var processingInfo = {};

    before('Setup', function() {
      dataEvent = new utils.DataEvent(constants.LOADEVENT);
      processingInfo = new utils.ProcessingInfo(utils.dbProjectPath(testConstants.UNITTESTPROJECT));
      processingInfo.sourceSystem = testClass;
      this.loadRawData = Sinon.stub(testClass, 'loadRawData').resolves(1);
      this.getAllData = Sinon.stub(myDatastore, 'getAllData').rejects('Error');
    });

    after('Restore', function() {
      testClass.loadRawData.restore();
      myDatastore.getAllData.restore();
    });

    it('trap read error', function() {
      return dataLoader.processProjectSystem(effortLoader, ANEFFORTSYSTEM, dataEvent, processingInfo)
      .then ( function(returnValue) {
        Should(returnValue.status).equal(constants.FAILEDEVENT);
      }).catch ( function() {
        Should.ok(false);
      });
    });
  });

  describe('testDataLoader - Test Error Writting Common Data', function() {
    var dataEvent = {};
    var processingInfo = {};

    before('Setup', function() {
      dataEvent = new utils.DataEvent(constants.LOADEVENT);
      processingInfo = new utils.ProcessingInfo(utils.dbProjectPath(testConstants.UNITTESTPROJECT));
      processingInfo.sourceSystem = testClass;
      this.loadRawData = Sinon.stub(testClass, 'loadRawData').resolves(1);
      this.getAllData = Sinon.stub(myDatastore, 'getAllData').resolves(RAWDATA);
      this.wipeAndStoreData = Sinon.stub(myDatastore, 'wipeAndStoreData').rejects('Error');
    });

    after('Restore', function() {
      testClass.loadRawData.restore();
      myDatastore.getAllData.restore();
      myDatastore.wipeAndStoreData.restore();
    });

    it('trap wipe error', function() {
      return dataLoader.processProjectSystem(effortLoader, ANEFFORTSYSTEM, dataEvent, processingInfo)
      .then ( function(returnValue) {
        Should(returnValue.status).equal(constants.FAILEDEVENT);
      }).catch ( function() {
        Should.ok(false);
      });
    });
  });

  describe('testDataLoader - Test Error Writting Summary Data', function() {
    var dataEvent = {};
    var processingInfo = {};

    before('Setup', function() {
      dataEvent = new utils.DataEvent(constants.LOADEVENT);
      processingInfo = new utils.ProcessingInfo(utils.dbProjectPath(testConstants.UNITTESTPROJECT));
      processingInfo.sourceSystem = testClass;
      this.loadRawData = Sinon.stub(testClass, 'loadRawData').resolves(1);
      this.getAllData = Sinon.stub(myDatastore, 'getAllData').resolves(RAWDATA);
      this.wipeAndStoreData = Sinon.stub(myDatastore, 'wipeAndStoreData');
      this.wipeAndStoreData.onCall(0).resolves(EXPECTEDCOMMONDATA);
      this.wipeAndStoreData.onCall(1).rejects('Error');
    });

    after('Restore', function() {
      testClass.loadRawData.restore();
      myDatastore.getAllData.restore();
      myDatastore.wipeAndStoreData.restore();
    });

    it('trap wipe error', function() {
      return dataLoader.processProjectSystem(effortLoader, ANEFFORTSYSTEM, dataEvent, processingInfo)
      .then ( function(returnValue) {
        Should(returnValue.status).equal(constants.FAILEDEVENT);
      }).catch ( function() {
        Should.ok(false);
      });
    });
  });

  describe('testDataLoader - Finding or not finding a demand or defect or effort system', function() {
    var aProject = {};
    var dataEvent = {};
    var effortSpy = {};
    var demandSpy = {};

    before('Setup', function() {
      dataEvent = new utils.DataEvent(constants.LOADEVENT);
      // NOTICE
      // There are 3 differnt styles for demand, defect, and effort on purpose
      // demand is null and effort is an empty objects - these are ways that projects have been structured in the plfu-feasability
      // defect is how Synpase creates a default empty project
      aProject = {
        name: 'COLLECTION-FOR-UNITESTING', // warning - I can't figure out how to use runtime constants for defineing other constants - change at your own risk
        program: "Projection Test Data",
        portfolio: "Unit Test Data",
        description: "A set of basic test data to be used to validate behavior of client systems.",
        startDate: null,
        endDate: null,
        demand: null,
        defect: { severity:[] },
        effort: {},
        projection: {}
      };

      effortSpy = Sinon.spy(effortLoader, 'configureProcessingInstructions');
      demandSpy = Sinon.spy(demandLoader, 'configureProcessingInstructions');
    });

    after('Cleanup', function() {
      effortLoader.configureProcessingInstructions.restore();
      demandLoader.configureProcessingInstructions.restore();
    });

    it('Act', function(done) {
      dataLoader.processProjectData(aProject, dataEvent);
      Should(effortSpy.callCount).equal(0);
      Should(demandSpy.callCount).equal(0);
      done();
    });
  });

  describe('testDataLoader - Make sure that process raw data is not called for a REPROCESS event', function() {
    var dataEvent = {};
    var processingInfo = {};
    var getDataStub = {};
    var loadRawDataSpy = {};

    before('Setup', function() {
      dataEvent = new utils.DataEvent(constants.REPROCESSEVENT);
      processingInfo = new utils.ProcessingInfo(utils.dbProjectPath(testConstants.UNITTESTPROJECT));
      processingInfo.sourceSystem = testClass;

      getDataStub = Sinon.stub(myDatastore, 'getAllData').resolves([]);
      loadRawDataSpy = Sinon.spy(testClass, 'loadRawData');
    });

    after('Restore', function() {
      testClass.loadRawData.restore();
      myDatastore.getAllData.restore();
    });

    it('trap empty result', function() {
      return dataLoader.processProjectSystem(effortLoader, ANEFFORTSYSTEM, dataEvent, processingInfo)
      .then ( function(returnValue) {
        Should(returnValue.status).equal(constants.SUCCESSEVENT);
        Should(getDataStub.callCount).equal(1);
        Should(loadRawDataSpy.callCount).equal(0);
      }).catch ( function() {
        Should.ok(false);
      });
    });
  });

  describe('testDataLoader - calls event.processEventData after processing a system', () => { 
    const sandbox = Sinon.sandbox.create();
    const aProject = {
      name: 'COLLECTION-FOR-UNITESTING', // warning - I can't figure out how to use runtime constants for defineing other constants - change at your own risk
      program: "Projection Test Data",
      portfolio: "Unit Test Data",
      description: "A set of basic test data to be used to validate behavior of client systems.",
      startDate: null,
      endDate: null,
      demand: { source: 'a source', url: 'a url' },
      defect: { source: 'a source', url: 'a url' },
      effort: { source: 'a source', url: 'a url' },
      projection: {}
    };
    const dataEvent = new utils.DataEvent(constants.LOADEVENT);
    let stub = sandbox.stub();
    beforeEach(() => {
      stub = sandbox.stub();
      sandbox.stub(event ,'processEventData').returns(stub);
    });

    it('sets up the processEventData', () => {
      dataLoader.processProjectData(aProject, dataEvent);
      Should(event.processEventData.getCall(0).args[0]).equal(aProject);
    })

    it('processes demand data', () => {
      sandbox.stub(dataLoader, 'processProjectSystem').resolves({ a: 'demandEvent'});
      dataLoader.processProjectData(aProject, dataEvent);
      // Have to wait for processProjectSystem and processEventData to complete, so 2 ticks
      return new Promise(process.nextTick)
      .then(() =>
        new Promise(resolve => {
          process.nextTick(() => {
            Should(stub.getCall(0).args[0]).match({ a: 'demandEvent'});
            Should(stub.getCall(0).args[2]).match(dataEvent._id);
            resolve();
          });
        })
      );
    });

    it('processes defect data', () => {
      sandbox.stub(dataLoader, 'processProjectSystem').resolves({ a: 'defectEvent'});
      dataLoader.processProjectData(aProject, dataEvent);
      // Have to wait for processProjectSystem and processEventData to complete, so 2 ticks
      return new Promise(process.nextTick)
      .then(() =>
        new Promise(resolve => {
          process.nextTick(() => {
            Should(stub.getCall(0).args[0]).match({ a: 'defectEvent'});
            Should(stub.getCall(0).args[2]).match(dataEvent._id);
            resolve();
          });
        })
      );
    });

    it('processes effort data', () => {
      sandbox.stub(dataLoader, 'processProjectSystem').resolves({ an: 'effortEvent'});
      dataLoader.processProjectData(aProject, dataEvent);
      // Have to wait for processProjectSystem and processEventData to complete, so 2 ticks
      return new Promise(process.nextTick)
      .then(() =>
        new Promise(resolve => {
          process.nextTick(() => {
            Should(stub.getCall(0).args[0]).match({ an: 'effortEvent'});
            Should(stub.getCall(0).args[2]).match(dataEvent._id);
            resolve();
          });
        })
      );
    });

    afterEach(() => {
      sandbox.restore();
    })
  });
});

