
const Config = require('config');
const HttpStatus = require('http-status-codes');
const Log4js = require('log4js');
const Should = require('should');
const Sinon = require('sinon');
const CO = require('co');
const R = require('ramda');

const jira = require('./');
const Rest = require('../../restler-as-promise');
const localConstants = require('../../constants');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.let = Config.get('log-level');

// NOTE:  I had to put an 'a' in front of the avart urls to get past compiler errors
const RAWJIRASTORY = {
      "expand": "operations,versionedRepresentations,editmeta,changelog,renderedFields",
      "id": "24904",
      "self": "https://digitalrig.atlassian.net/rest/api/latest/issue/24904",
      "key": "SYNAPSE-88",
      "changelog":
      {
          "startAt": 0,
          "maxResults": 2,
          "total": 2,
          "histories":
          [
              {
                  "id": "47774",
                  "author":
                  {
                      "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=digitalrig",
                      "name": "digitalrig",
                      "key": "digitalrig",
                      "emailAddress": "paul.karsten@wipro.com",
                      "avatarUrls":
                      {
                          "48x48": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=48",
                          "24x24": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=24",
                          "16x16": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=16",
                          "32x32": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=32"
                      },
                      "displayName": "Paul Karsten [Administrator]",
                      "active": true,
                      "timeZone": "America/Denver"
                  },
                  "created": "2016-11-23T14:39:12.428-0700",
                  "items":
                  [
                      {
                          "field": "status",
                          "fieldtype": "jira",
                          "from": "10000",
                          "fromString": "Backlog",
                          "to": "10001",
                          "toString": "Selected for development"
                      }
                  ]
              },
              {
                  "id": "47976",
                  "author":
                  {
                      "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=digitalrig",
                      "name": "digitalrig",
                      "key": "digitalrig",
                      "emailAddress": "paul.karsten@wipro.com",
                      "avatarUrls":
                      {
                          "48x48": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=48",
                          "24x24": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=24",
                          "16x16": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=16",
                          "32x32": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=32"
                      },
                      "displayName": "Paul Karsten [Administrator]",
                      "active": true,
                      "timeZone": "America/Denver"
                  },
                  "created": "2016-11-28T13:16:16.733-0700",
                  "items":
                  [
                      {
                          "field": "priority",
                          "fieldtype": "jira",
                          "from": "3",
                          "fromString": "Medium",
                          "to": "2",
                          "toString": "High"
                      }
                  ]
              }
          ]
      },
      "fields":
      {
          "summary": "Project Creation Journey Broken",
          "issuetype":
          {
              "self": "https://digitalrig.atlassian.net/rest/api/2/issuetype/1",
              "id": "1",
              "description": "A problem which impairs or prevents the functions of the product.",
              "iconUrl": "https://digitalrig.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10303&avatarType=issuetype",
              "name": "Bug",
              "subtask": false,
              "avatarId": 10303
          },
          "created": "2016-11-23T14:39:04.000-0700",
          "reporter":
          {
              "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=digitalrig",
              "name": "digitalrig",
              "key": "digitalrig",
              "emailAddress": "paul.karsten@wipro.com",
              "avatarUrls":
              {
                  "48x48": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=48",
                  "24x24": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=24",
                  "16x16": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=16",
                  "32x32": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=32"
              },
              "displayName": "Paul Karsten [Administrator]",
              "active": true,
              "timeZone": "America/Denver"
          },
          "priority":
          {
              "self": "https://digitalrig.atlassian.net/rest/api/2/priority/2",
              "iconUrl": "https://digitalrig.atlassian.net/images/icons/priorities/high.svg",
              "name": "High",
              "id": "2"
          },
          "updated": "2016-11-28T13:16:16.000-0700",
          "status":
          {
              "self": "https://digitalrig.atlassian.net/rest/api/2/status/10001",
              "description": "",
              "iconUrl": "https://digitalrig.atlassian.net/images/icons/subtask.gif",
              "name": "Selected for development",
              "id": "10001",
              "statusCategory":
              {
                  "self": "https://digitalrig.atlassian.net/rest/api/2/statuscategory/4",
                  "id": 4,
                  "key": "indeterminate",
                  "colorName": "yellow",
                  "name": "In Progress"
              }
          }
      }
  };

const EMPTYJIRARESPONSE = {
  startAt: 0,
  maxResults: 50,
  total: 555,
  issues: []
};

const SINGLEJIRARESPOSE = {
  startAt: 0,
  maxResults: 50,
  total: 1,
  issues: [RAWJIRASTORY]
};

const DEFECTINFO = {
  source: 'JIRA',
  url: "https://digitalrig.atlassian.net/rest/api/latest/",
  project: 'CIT',
  authPolicy: 'Basic',
  userData: 'ZGlnaXRhbHJpZzpEMWchdGFsUmln',
  flow: [{name: 'Backlog'}]};

const EXPECTEDCOMMON = [
  { _id: '24904',
    uri: 'https://digitalrig.atlassian.net/rest/api/latest/issue/24904',
      history:[
        {statusValue: 'CREATED', severity: 'Medium', startDate: '2016-11-23T14:39:04.000-0700', changeDate: '2016-11-23T14:39:12.428-0700'},
        {statusValue: 'Selected for development', severity: 'Medium', startDate: '2016-11-23T14:39:12.428-0700', changeDate: '2016-11-28T13:16:16.733-0700'},
        {statusValue: 'Selected for development', severity: 'High', startDate: '2016-11-28T13:16:16.733-0700', changeDate: null} ]
  }
];

const CODENOTFOUND = 404;
const MESSAGENOTFOUND = 'There Be Dragons';
const ERRORRESULT = {statusCode: CODENOTFOUND, statusMessage: MESSAGENOTFOUND};
const SINCETIME = '2000-01-01+00:00';

const processingInfo = {
  dbUrl: '',
  rawLocation: '',
  storageFunction(_, __, enhancedStories) {
    return Promise.resolve(enhancedStories);
  }
}

describe('Defect -> Jira ->', () => {
  const sandbox = Sinon.sandbox.create();

  afterEach(() => {
    sandbox.restore();
  })

  describe('Test Fixing of Jira Defect History', function() {
    it('Convert Jira Object', () => {
      sandbox.stub(Rest, 'get').resolves({ data: { issues: [R.clone(RAWJIRASTORY)] } });
      
      return jira.loadRawData(DEFECTINFO, processingInfo, null, (e) => e)
      .then(function(response) {
        Should(response[0].changelog.histories[0].items).not.Array();
      });
    });
  });
  
  describe('Empty result from Jira test', function() {
    var jiraResponse = {};
  
    beforeEach(function() {
      sandbox.stub(Rest, 'get');
      jiraResponse.statusCode = HttpStatus.OK;
    });
    
    it('Test Getting an empty set of Jira Defects', function() {
      Rest.get.resolves({ data: EMPTYJIRARESPONSE });
  
      return jira.loadRawData(DEFECTINFO, processingInfo, null, (e) => e)
      .then(function(response) {
        Should(response.length).equal(0);
      });
    });
  });
  
  describe('Test getting all of the defects in a single request. ', function() {
    var jiraResponse = {};
  
    beforeEach(function() {
      this.get = sandbox.stub(Rest, 'get');
      jiraResponse.statusCode = HttpStatus.OK;
    });
    
    it('Test Getting an empty set of Jira defects', function() {
      Rest.get.resolves({ data: SINGLEJIRARESPOSE, response: jiraResponse });
  
      return jira.loadRawData(DEFECTINFO, processingInfo, null, (e) => e)
        .then(function(response) {
          Should(response.length).equal(1);
        });
    });
  });
  
  
  describe('Test creating common defect format from Jira defects ', function() {
  
    it('Convert Jira Object', function(done) {
      var commonDataFormat = jira.transformRawToCommon([RAWJIRASTORY], DEFECTINFO);
  
      Should(commonDataFormat).match(EXPECTEDCOMMON);
      done();
    });
  });
  
  describe('Jira GetRawData - fail getting defects', function() {
    var aSetOfInfo = {};
  
    beforeEach(function() {
      sandbox.stub(Rest, 'get').rejects(ERRORRESULT);
    });

  
    it('Make sure the error is returned', function() {  
      return jira.loadRawData(DEFECTINFO, aSetOfInfo, SINCETIME, (e) => e)
        .then(function() {
          Should.ok(false);
        }).catch ( function(error) {
          logger.debug(error);
          Should(error).deepEqual(ERRORRESULT);
        });
    });
  });
  
  describe('testDefect()', () => {  
    const aProject = {
      name: 'Test Project',
      defect: {
        severity: [{ name: 'Backlog' }],
        source: 'Jira',
        url: 'http://some.url',
        project: 'Some Jira Project',
        authPolicy: 'Basic',
        userData: 'some secret key',
      }
    };
  
    it('returns an error when the url is invalid.', () => {
      return CO(function* () {
        const project = R.mergeDeepRight(aProject, { defect: { url: 'invalid url' } });
        const result = yield jira.testDefect(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when the jira [project] is an empty string', () => {
      return CO(function* () {
        const project = R.mergeDeepRight(aProject, { defect: { project: '' } });
        const result = yield jira.testDefect(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when the jira [project] is null', () => {
      return CO(function* () {
        const defect = R.omit(['project'], aProject.defect);
        const project = R.mergeDeepRight(R.omit(['defect'], aProject), { defect });
        const result = yield jira.testDefect(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when [authPolicy] is an empty string', () => {
      return CO(function* () {
        const project = R.mergeDeepRight(aProject, { defect: { authPolicy: '' } });
        const result = yield jira.testDefect(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when [authPolicy] is null', () => {
      return CO(function* () {
        const defect = R.omit(['authPolicy'], aProject.defect);
        const project = R.mergeDeepRight(R.omit(['defect'], aProject), { defect });
        const result = yield jira.testDefect(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when [userData] is an empty string', () => {
      return CO(function* () {
        const project = R.mergeDeepRight(aProject, { defect: { userData: '' } });
        const result = yield jira.testDefect(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when [userData] is null', () => {
      return CO(function* () {
        const defect = R.omit(['userData'], aProject.defect);
        const project = R.mergeDeepRight(R.omit(['defect'], aProject), { defect });
        const result = yield jira.testDefect(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when [severity] is an empty array', () => {
      return CO(function* () {
        const project = R.mergeDeepRight(aProject, { defect: { severity: [] } });
        const result = yield jira.testDefect(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when [severity] is null', () => {
      return CO(function* () {
        const defect = R.omit(['severity'], aProject.defect);
        const project = R.mergeDeepRight(R.omit(['defect'], aProject), { defect });
        const result = yield jira.testDefect(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns green when the request to Jira is successful', () => {
      return CO(function* () {
        sandbox.stub(Rest, 'get').resolves({});
        const result = yield jira.testDefect(aProject, localConstants);
        Should(result.status).equal(localConstants.STATUSOK);
      });
    })
  });
});
