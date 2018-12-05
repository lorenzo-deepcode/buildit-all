'use strict'

const Should = require('should');
const Sinon = require('sinon');
const CO = require('co');
const R = require('ramda');
const Config = require('config');
const Log4js = require('log4js');

const harvest = require('./');
const Rest = require('../../restler-as-promise');
const localConstants = require('../../constants');


Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

const GOODPROJECT = 10284278;
const BADPROJECT = 98765432;

const SINCETIME = '2000-01-01+00:00';

function errorBody(statusCode, message) {
  return {
    message,
    statusCode,
  }
}

const EFFORTINFO = {
  source: 'Harvest',
  url: 'https://builditglobal.harvestapp.com',
  project: GOODPROJECT,
  authPolicy: 'Basic',
  userData: 'cGF1bC5rYXJzdGVuQHdpcHJvLmNvbTpXaDFwSXRHMDBk',
  role: []};

const TIMERESPONSE = [
  {
    day_entry:
    {
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
    day_entry:
    {
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

const TASKREPONSE = [
  {
    "task":
    {
      "id": 6375838,
      "name": "Discovery",
      "billable_by_default": false,
      "created_at": "2016-08-02T09:16:49Z",
      "updated_at": "2016-09-13T12:26:15Z",
      "is_default": false,
      "default_hourly_rate": 0,
      "deactivated": false
    }
  },
  {
    "task":
    {
      "id": 5715688,
      "name": "Delivery",
      "billable_by_default": true,
      "created_at": "2016-03-15T12:46:08Z",
      "updated_at": "2016-03-15T13:12:49Z",
      "is_default": true,
      "default_hourly_rate": 0,
      "deactivated": false
    }
  }
];

const MODIFIEDTIMERESPONSE = [
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

const CODENOTFOUND = 404;
const MESSAGENOTFOUND = 'There Be Dragons';
const ERRORRESULT = {statusCode: CODENOTFOUND, statusMessage: MESSAGENOTFOUND};

const processingInfo = {
  dbUrl: '',
  rawLocation: '',
  storageFunction(_, __, enhancedStories) {
    return Promise.resolve(enhancedStories);
  }
}


describe('Effort -> Harvest ->', () => {

  const sandbox = Sinon.sandbox.create();

  afterEach(() => {
    sandbox.restore();
  });

  describe('testHarvest - Stubbed Tests', function() {
    const TIMEERRORMESSAGE = 'Error retrieving time entries from Harvest';
    const TASKERRORMESSAGE = 'Error retrieving task entries from Harvest';
  
    beforeEach(function() {
      sandbox.stub(Rest, 'get');
    });
  
    it('Test Get Time Entries', function() {
      Rest.get.onFirstCall().resolves({ data: TIMERESPONSE });
      Rest.get.onSecondCall().resolves({ data: TASKREPONSE });
  
      return harvest.loadRawData(EFFORTINFO, processingInfo, SINCETIME, errorBody)
        .then(function(response) {
          Should(response.length).be.above(0);
          Should(response[0].day_entry).have.property('spent_at');
          Should(response[0].day_entry).have.property('task_id');
        });
    });
  
    it('Test Getting an empty set Time Entries', function() {
      Rest.get.resolves({ data: [] })
  
      return harvest.loadRawData(EFFORTINFO, processingInfo, null, errorBody)
        .then(function(response) {
          Should(response.length).equal(0);
        });
    });
  
    it('Test Error Getting Time Entries for a non-existant project', function() {
      Rest.get.rejects({ data: null, response: ERRORRESULT });
  
      var badEffort = JSON.parse(JSON.stringify(EFFORTINFO));
      badEffort.project = BADPROJECT;
      return harvest.loadRawData(badEffort, processingInfo, SINCETIME, errorBody)
        .catch((response) => {
          Should(response).not.be.null;
          Should(response.statusCode).equal(CODENOTFOUND);
          Should(response.message).equal(TIMEERRORMESSAGE);
        });
    });
  
    it('Test Get Task Entries', function() {
      Rest.get.onFirstCall().resolves({ data: TIMERESPONSE });
      Rest.get.onSecondCall().resolves({ data: TASKREPONSE });
  
      return harvest.loadRawData(EFFORTINFO, processingInfo, null, errorBody)
        .then(function(response) {
          Should(response[0].day_entry.task_id).equal(5715688);
        });
    });
  
    it('Test Getting a 404 response on Task Entries', function() {
      Rest.get.onFirstCall().resolves({ data: TIMERESPONSE });
      Rest.get.onSecondCall().rejects({ data: null, response: ERRORRESULT });
  
      return harvest.loadRawData(EFFORTINFO, processingInfo, null,errorBody)
        .catch((reason) => {
          Should(reason).not.be.null;
          Should(reason.statusCode).equal(CODENOTFOUND);
          Should(reason.message).equal(TASKERRORMESSAGE);
        });
    });

    it('Translate task_id into task_name', function() {
      Rest.get.onFirstCall().resolves({ data: TIMERESPONSE });
      Rest.get.onSecondCall().resolves({ data: TASKREPONSE });
    
      return harvest.loadRawData(EFFORTINFO, processingInfo, null, errorBody)
      .then(function(response) {
        Should(response[0].day_entry).have.property('task_name');
      });
    });
  });
  
  describe('testHarvest -  Data Convertion Test', function() {
    it('Convert', function() {
      sandbox.stub(Rest, 'get');
      Rest.get.onFirstCall().resolves({ data: TIMERESPONSE });
      Rest.get.onSecondCall().resolves({ data: TASKREPONSE });
    
      return harvest.loadRawData(EFFORTINFO, processingInfo, null, errorBody)
      .then(rawData => {
        var commonDataFormat = harvest.transformRawToCommon(rawData);
        Should(commonDataFormat).deepEqual(EXPECTEDCOMMONDATA);
      });
    });
  });
  
  
  describe('testHarvest -  GetRawData - fail getting time', function() {
    var aSetOfInfo = {};
  
    beforeEach(function() {
      sandbox.stub(Rest, 'get');
      Rest.get.onFirstCall().rejects(ERRORRESULT);
    });
    
    it('Make sure the error is returned', function() {
  
      return harvest.loadRawData(EFFORTINFO, aSetOfInfo, SINCETIME)
        .then(function() {
          Should.ok(false);
        }).catch ( function(error) {
          Should(error).deepEqual(ERRORRESULT);
        });
    });
  });
  
  describe('testHarvest - GetRawData - fail getting task', function() {
    var aSetOfInfo = {};
  
    beforeEach(function() {
      sandbox.stub(Rest, 'get');
      Rest.get.onFirstCall().resolves({ data: TIMERESPONSE });
      Rest.get.onSecondCall().rejects(ERRORRESULT);
    });
    
    it('Make sure the error is returned', function() {
  
      return harvest.loadRawData(EFFORTINFO, aSetOfInfo, SINCETIME)
        .then(function() {
          Should.ok(false);
        }).catch ( function(error) {
          logger.debug(error);
          Should(error).deepEqual(ERRORRESULT);
        });
    });
  });
  
  describe('GetRawData -> make sure count is returned ->', function() {
    var aSetOfInfo = {};
  
    beforeEach(function() {
      sandbox.stub(Rest, 'get');
      Rest.get.onFirstCall().resolves({ data: TIMERESPONSE });
      Rest.get.onSecondCall().resolves({ data: TASKREPONSE });
  
      aSetOfInfo = {
        dbUrl: 'a db url',
        rawLocation: 'a location',
        storageFunction() { return Promise.resolve(MODIFIEDTIMERESPONSE); },
      };
    });
  
    it('Make sure the proper count', function() {
  
      return harvest.loadRawData(EFFORTINFO, aSetOfInfo, SINCETIME)
      .then(function(response) {
        Should(response).deepEqual(MODIFIEDTIMERESPONSE);
      });
    });
  });
  
  describe('test/testHarvest - Harvest testEffort()', () => {
    const sandbox = Sinon.sandbox.create();
  
    const aProject = {
      name: 'Test Project',
      effort: {
        role: [{ name : `General / Delivery`, groupWith : "" }],
        source: 'Harvest',
        url: 'http://some.url',
        project: 'Some Harvest Project',
        authPolicy: 'Basic',
        userData: 'some secret key',
      }
    };
  
    afterEach(() => {
      sandbox.restore();
    })
  
    it('returns an error when the url is invalid.', () => {
      return CO(function* () {
        const project = R.mergeDeepRight(aProject, { effort: { url: 'invalid url' } });
        const result = yield harvest.testEffort(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when the harvest [project] is an empty string', () => {
      return CO(function* () {
        const project = R.mergeDeepRight(aProject, { effort: { project: '' } });
        const result = yield harvest.testEffort(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when the harvest [project] is null', () => {
      return CO(function* () {
        const effort = R.omit(['project'], aProject.effort);
        const project = R.mergeDeepRight(R.omit(['effort'], aProject), { effort });
        const result = yield harvest.testEffort(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when [authPolicy] is an empty string', () => {
      return CO(function* () {
        const project = R.mergeDeepRight(aProject, { effort: { authPolicy: '' } });
        const result = yield harvest.testEffort(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when [authPolicy] is null', () => {
      return CO(function* () {
        const effort = R.omit(['authPolicy'], aProject.effort);
        const project = R.mergeDeepRight(R.omit(['effort'], aProject), { effort });
        const result = yield harvest.testEffort(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when [userData] is an empty string', () => {
      return CO(function* () {
        const project = R.mergeDeepRight(aProject, { effort: { userData: '' } });
        const result = yield harvest.testEffort(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when [userData] is null', () => {
      return CO(function* () {
        const effort = R.omit(['userData'], aProject.effort);
        const project = R.mergeDeepRight(R.omit(['effort'], aProject), { effort });
        const result = yield harvest.testEffort(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when [role] is an empty array', () => {
      return CO(function* () {
        const project = R.mergeDeepRight(aProject, { effort: { role: '' } });
        const result = yield harvest.testEffort(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when [role] is null', () => {
      return CO(function* () {
        const effort = R.omit(['role'], aProject.effort);
        const project = R.mergeDeepRight(R.omit(['effort'], aProject), { effort });
        const result = yield harvest.testEffort(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns green when the request to harvest is successful', () => {
      return CO(function* () {
        sandbox.stub(Rest, 'get').resolves();
        const result = yield harvest.testEffort(aProject, localConstants);
        Should(result.status).equal(localConstants.STATUSOK);
      });
    });

    it('returns red when the request to harvest fails', () => {
      return CO(function* () {
        sandbox.stub(Rest, 'get').rejects();
        const result = yield harvest.testEffort(aProject, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  });
});

