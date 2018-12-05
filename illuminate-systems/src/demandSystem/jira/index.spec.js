const jira = require('./');
const Config = require('config');
const Log4js = require('log4js');
const Should = require('should');
const Sinon = require('sinon');
const R = require('ramda');
const CO = require('co');

const Rest = require('../../restler-as-promise');
const localConstants = require('../../constants');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

const RAWJIRASTORY = {
    "expand": "operations,versionedRepresentations,editmeta,changelog,renderedFields",
    "id": "18020",
    "self": "https://digitalrig.atlassian.net/rest/api/latest/issue/18020",
    "key": "NETWRKDIAG-120",
    "changelog": {
      "startAt": 0,
      "maxResults": 15,
      "total": 15,
      "histories": [
        {
          "id": "35791",
          "author": {
            "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=david.moss",
            "name": "david.moss",
            "key": "david.moss",
            "emailAddress": "david.moss@wipro.com",
            "avatarUrls": {
              "48x48": "https://digitalrig.atlassian.net/secure/useravatar?ownerId=david.moss&avatarId=11700",
              "24x24": "https://digitalrig.atlassian.net/secure/useravatar?size=small&ownerId=david.moss&avatarId=11700",
              "16x16": "https://digitalrig.atlassian.net/secure/useravatar?size=xsmall&ownerId=david.moss&avatarId=11700",
              "32x32": "https://digitalrig.atlassian.net/secure/useravatar?size=medium&ownerId=david.moss&avatarId=11700"
            },
            "displayName": "David Moss",
            "active": true,
            "timeZone": "America/Denver"
          },
          "created": "2016-05-20T09:19:59.040-0600",
          "items": [
              {
                "field": "Rank",
                "fieldtype": "custom",
                "from": "",
                "fromString": "",
                "to": "",
                "toString": "Ranked higher"
              }
          ]
        },
        {
          "id": "35811",
          "author": {
            "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=digitalrig",
            "name": "digitalrig",
            "key": "digitalrig",
            "emailAddress": "paul.karsten@wipro.com",
            "avatarUrls": {
              "48x48": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=48",
              "24x24": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=24",
              "16x16": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=16",
              "32x32": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=32"
            },
            "displayName": "Paul Karsten [Administrator]",
            "active": true,
            "timeZone": "America/Denver"
          },
          "created": "2016-05-20T14:18:35.251-0600",
          "items": [
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
          "id": "36268",
          "author": {
            "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=david.moss",
            "name": "david.moss",
            "key": "david.moss",
            "emailAddress": "david.moss@wipro.com",
            "avatarUrls": {
              "48x48": "https://digitalrig.atlassian.net/secure/useravatar?ownerId=david.moss&avatarId=11700",
              "24x24": "https://digitalrig.atlassian.net/secure/useravatar?size=small&ownerId=david.moss&avatarId=11700",
              "16x16": "https://digitalrig.atlassian.net/secure/useravatar?size=xsmall&ownerId=david.moss&avatarId=11700",
              "32x32": "https://digitalrig.atlassian.net/secure/useravatar?size=medium&ownerId=david.moss&avatarId=11700"
            },
            "displayName": "David Moss",
            "active": true,
            "timeZone": "America/Denver"
          },
          "created": "2016-05-26T07:20:52.350-0600",
          "items": [
              {
                "field": "status",
                "fieldtype": "jira",
                "from": "10001",
                "fromString": "Selected for development",
                "to": "10000",
                "toString": "Backlog"
              }
          ]
        },
        {
          "id": "39983",
          "author": {
            "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=digitalrig",
            "name": "digitalrig",
            "key": "digitalrig",
            "emailAddress": "paul.karsten@wipro.com",
            "avatarUrls": {
              "48x48": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=48",
              "24x24": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=24",
              "16x16": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=16",
              "32x32": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=32"
            },
            "displayName": "Paul Karsten [Administrator]",
            "active": true,
            "timeZone": "America/Denver"
          },
          "created": "2016-08-01T08:21:33.563-0600",
          "items": [
              {
                "field": "description",
                "fieldtype": "jira",
                "from": null,
                "fromString": "Ability to see a history / revisions to a twiglet and load/rollback to an older version - TBD",
                "to": null,
                "toString": "Ability to see a history / revisions to a twiglet.\r\n\r\nPerhaps something a simple as forcing a commit comment each time a user saves."
              }
          ]
        },
        {
          "id": "39984",
          "author": {
            "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=digitalrig",
            "name": "digitalrig",
            "key": "digitalrig",
            "emailAddress": "paul.karsten@wipro.com",
            "avatarUrls": {
              "48x48": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=48",
              "24x24": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=24",
              "16x16": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=16",
              "32x32": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=32"
            },
            "displayName": "Paul Karsten [Administrator]",
            "active": true,
            "timeZone": "America/Denver"
          },
          "created": "2016-08-01T08:21:38.015-0600",
          "items": [
              {
                "field": "Rank",
                "fieldtype": "custom",
                "from": "",
                "fromString": "",
                "to": "",
                "toString": "Ranked higher"
              }
          ]
        },
        {
          "id": "39985",
          "author": {
            "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=digitalrig",
            "name": "digitalrig",
            "key": "digitalrig",
            "emailAddress": "paul.karsten@wipro.com",
            "avatarUrls": {
              "48x48": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=48",
              "24x24": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=24",
              "16x16": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=16",
              "32x32": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=32"
            },
            "displayName": "Paul Karsten [Administrator]",
            "active": true,
            "timeZone": "America/Denver"
          },
          "created": "2016-08-01T08:21:43.854-0600",
          "items": [
              {
                "field": "Rank",
                "fieldtype": "custom",
                "from": "",
                "fromString": "",
                "to": "",
                "toString": "Ranked higher"
              }
          ]
        },
        {
          "id": "39986",
          "author": {
            "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=digitalrig",
            "name": "digitalrig",
            "key": "digitalrig",
            "emailAddress": "paul.karsten@wipro.com",
            "avatarUrls": {
              "48x48": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=48",
              "24x24": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=24",
              "16x16": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=16",
              "32x32": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=32"
            },
            "displayName": "Paul Karsten [Administrator]",
            "active": true,
            "timeZone": "America/Denver"
          },
          "created": "2016-08-01T08:21:58.244-0600",
          "items": [
              {
                "field": "Rank",
                "fieldtype": "custom",
                "from": "",
                "fromString": "",
                "to": "",
                "toString": "Ranked higher"
              }
          ]
        },
        {
          "id": "39987",
          "author": {
            "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=digitalrig",
            "name": "digitalrig",
            "key": "digitalrig",
            "emailAddress": "paul.karsten@wipro.com",
            "avatarUrls": {
              "48x48": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=48",
              "24x24": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=24",
              "16x16": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=16",
              "32x32": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=32"
            },
            "displayName": "Paul Karsten [Administrator]",
            "active": true,
            "timeZone": "America/Denver"
          },
          "created": "2016-08-01T08:22:04.715-0600",
          "items": [
              {
                "field": "Rank",
                "fieldtype": "custom",
                "from": "",
                "fromString": "",
                "to": "",
                "toString": "Ranked higher"
              }
          ]
        },
        {
          "id": "43883",
          "author": {
            "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=andrew.ochsner",
            "name": "andrew.ochsner",
            "key": "andrew.ochsner",
            "emailAddress": "andrew.ochsner@wipro.com",
            "avatarUrls": {
              "48x48": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=48",
              "24x24": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=24",
              "16x16": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=16",
              "32x32": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=32"
            },
            "displayName": "Andrew Ochsner",
            "active": true,
            "timeZone": "America/Chicago"
          },
          "created": "2016-09-28T13:53:21.498-0600",
          "items": [
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
          "id": "43884",
          "author": {
            "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=andrew.ochsner",
            "name": "andrew.ochsner",
            "key": "andrew.ochsner",
            "emailAddress": "andrew.ochsner@wipro.com",
            "avatarUrls": {
              "48x48": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=48",
              "24x24": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=24",
              "16x16": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=16",
              "32x32": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=32"
            },
            "displayName": "Andrew Ochsner",
            "active": true,
            "timeZone": "America/Chicago"
          },
          "created": "2016-09-28T13:53:24.787-0600",
          "items": [
              {
                "field": "status",
                "fieldtype": "jira",
                "from": "10001",
                "fromString": "Selected for development",
                "to": "10501",
                "toString": "In Progress"
              }
          ]
        },
        {
          "id": "43885",
          "author": {
            "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=andrew.ochsner",
            "name": "andrew.ochsner",
            "key": "andrew.ochsner",
            "emailAddress": "andrew.ochsner@wipro.com",
            "avatarUrls": {
              "48x48": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=48",
              "24x24": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=24",
              "16x16": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=16",
              "32x32": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=32"
            },
            "displayName": "Andrew Ochsner",
            "active": true,
            "timeZone": "America/Chicago"
          },
          "created": "2016-09-28T13:53:29.019-0600",
          "items": [
              {
                "field": "assignee",
                "fieldtype": "jira",
                "from": null,
                "fromString": null,
                "to": "andrew.ochsner",
                "toString": "Andrew Ochsner"
              }
          ]
        },
        {
          "id": "46169",
          "author": {
            "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=andrew.ochsner",
            "name": "andrew.ochsner",
            "key": "andrew.ochsner",
            "emailAddress": "andrew.ochsner@wipro.com",
            "avatarUrls": {
              "48x48": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=48",
              "24x24": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=24",
              "16x16": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=16",
              "32x32": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=32"
            },
            "displayName": "Andrew Ochsner",
            "active": true,
            "timeZone": "America/Chicago"
          },
          "created": "2016-11-04T13:06:55.686-0600",
          "items": [
              {
                "field": "resolution",
                "fieldtype": "jira",
                "from": null,
                "fromString": null,
                "to": "10000",
                "toString": "Done"
              }
          ]
        },
        {
          "id": "46170",
          "author": {
            "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=andrew.ochsner",
            "name": "andrew.ochsner",
            "key": "andrew.ochsner",
            "emailAddress": "andrew.ochsner@wipro.com",
            "avatarUrls": {
              "48x48": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=48",
              "24x24": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=24",
              "16x16": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=16",
              "32x32": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=32"
            },
            "displayName": "Andrew Ochsner",
            "active": true,
            "timeZone": "America/Chicago"
          },
          "created": "2016-11-04T13:07:07.540-0600",
          "items": [
              {
                "field": "resolution",
                "fieldtype": "jira",
                "from": "10000",
                "fromString": "Done",
                "to": null,
                "toString": null
              }
          ]
        },
        {
          "id": "46405",
          "author": {
            "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=andrew.ochsner",
            "name": "andrew.ochsner",
            "key": "andrew.ochsner",
            "emailAddress": "andrew.ochsner@wipro.com",
            "avatarUrls": {
              "48x48": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=48",
              "24x24": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=24",
              "16x16": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=16",
              "32x32": "https://secure.gravatar.com/avatar/c2e3878c3795ee6593eb8e1441681e0b?d=mm&s=32"
            },
            "displayName": "Andrew Ochsner",
            "active": true,
            "timeZone": "America/Chicago"
          },
          "created": "2016-11-09T07:49:44.193-0700",
          "items": [
              {
                "field": "resolution",
                "fieldtype": "jira",
                "from": null,
                "fromString": null,
                "to": "10000",
                "toString": "Done"
              }
          ]
        },
        {
          "id": "48830",
          "author": {
            "self": "https://digitalrig.atlassian.net/rest/api/2/user?username=digitalrig",
            "name": "digitalrig",
            "key": "digitalrig",
            "emailAddress": "paul.karsten@wipro.com",
            "avatarUrls": {
              "48x48": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=48",
              "24x24": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=24",
              "16x16": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=16",
              "32x32": "https://secure.gravatar.com/avatar/886f42fb26825693a4c0fcf96ba08ed0?d=mm&s=32"
            },
            "displayName": "Paul Karsten [Administrator]",
            "active": true,
            "timeZone": "America/Denver"
          },
          "created": "2016-12-12T15:09:30.696-0700",
          "items": [
              {
                "field": "Fix Version",
                "fieldtype": "jira",
                "from": null,
                "fromString": null,
                "to": "12100",
                "toString": "1.5"
              }
          ]
        }
      ]
    },
    "fields": {
      "summary": "Show a history of changes to a twiglet",
      "issuetype": {
        "self": "https://digitalrig.atlassian.net/rest/api/2/issuetype/10001",
        "id": "10001",
        "description": "A user story. Created by JIRA Software - do not edit or delete.",
        "iconUrl": "https://digitalrig.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10315&avatarType=issuetype",
        "name": "Story",
        "subtask": false,
        "avatarId": 10315
      },
      "updated": "2016-12-12T15:09:30.000-0700",
      "created": "2016-05-20T09:19:51.000-0600",
      "status": {
        "self": "https://digitalrig.atlassian.net/rest/api/2/status/10002",
        "description": "Issues can only move to done after they've been tested",
        "iconUrl": "https://digitalrig.atlassian.net/images/icons/subtask.gif",
        "name": "Done",
        "id": "10002",
        "statusCategory": {
          "self": "https://digitalrig.atlassian.net/rest/api/2/statuscategory/3",
          "id": 3,
          "key": "done",
          "colorName": "green",
          "name": "Done"
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

const DEMANDINFO = {
  source: 'JIRA',
  url: "https://digitalrig.atlassian.net/rest/api/latest/",
  project: 'CIT',
  authPolicy: 'Basic',
  userData: 'ZGlnaXRhbHJpZzpEMWchdGFsUmln',
  flow: [{name: 'Backlog'}]};

const EXPECTEDCOMMON = [
  { _id: '18020',
    uri: 'https://digitalrig.atlassian.net/rest/api/latest/issue/18020',
      history:[
        {statusValue: 'Backlog', startDate: '2016-05-20T09:19:51.000-0600', changeDate: '2016-05-20T14:18:35.251-0600'},
        {statusValue: 'Selected for development', startDate: '2016-05-20T14:18:35.251-0600', changeDate: '2016-05-26T07:20:52.350-0600'},
        {statusValue: 'Backlog', startDate: '2016-05-26T07:20:52.350-0600', changeDate: '2016-09-28T13:53:21.498-0600'},
        {statusValue: 'Selected for development', startDate: '2016-09-28T13:53:21.498-0600', changeDate: '2016-09-28T13:53:24.787-0600'},
        {statusValue: 'In Progress', startDate: '2016-09-28T13:53:24.787-0600', changeDate: '2016-11-04T13:06:55.686-0600'},
        {statusValue: 'Done', startDate: '2016-11-04T13:06:55.686-0600', changeDate: '2016-11-04T13:07:07.540-0600'},
        {statusValue: 'In Progress', startDate: '2016-11-04T13:07:07.540-0600', changeDate: '2016-11-09T07:49:44.193-0700'},
        {statusValue: 'Done', startDate: '2016-11-09T07:49:44.193-0700', changeDate: '2016-12-12T15:09:30.696-0700'},
        {statusValue: 'Fix Version-1.5', startDate: '2016-12-12T15:09:30.696-0700', changeDate: null} ]
  }];

const CODENOTFOUND = 404;
const MESSAGENOTFOUND = 'There Be Dragons';
const ERRORRESULT = {statusCode: CODENOTFOUND, statusMessage: MESSAGENOTFOUND};
const SINCETIME = '2000-01-01+00:00';

function errorBody(statusCode, message) {
  return {
    message,
    statusCode,
  }
}

const processingInfo = {
  dbUrl: '',
  rawLocation: '',
  storageFunction(_, __, enhancedStories) {
    return Promise.resolve(enhancedStories);
  }
}

describe('Demand -> Jira ->', () => {
  const sandbox = Sinon.sandbox.create();

  afterEach(() => {
    sandbox.restore();
  })

  describe('Test processing History Data', function() {

      beforeEach(() => {
        sandbox.stub(Rest, 'get').resolves({ data: { issues: [R.clone(RAWJIRASTORY)] } });
      });
  
      it('remove the history array add _id', function() {
        return jira.loadRawData(DEMANDINFO, processingInfo, null, errorBody)
        .then(rawStories =>{
          Should(rawStories[0].changelog.histories[0].items).not.Array();
          Should(rawStories[0]).have.property('_id');
        });
      });
  
      it('convert Jira issue to common format', function() {
        return jira.loadRawData(DEMANDINFO, processingInfo, null, errorBody)
        .then(rawStories =>{
          const commonDataFormat = jira.transformRawToCommon(rawStories, DEMANDINFO);
          Should(commonDataFormat).match(EXPECTEDCOMMON);
        });
      });
  });
  
  describe('Correctly process an empty response from Jira ->', function() {
    var jiraResponse = {};
  
    beforeEach(function() {
      sandbox.stub(Rest, 'get')
    });
  
    it('Test Getting an empty set of Jira Issues', function() {
      Rest.get.resolves({ data: EMPTYJIRARESPONSE, response: jiraResponse });
      return jira.loadRawData(DEMANDINFO, processingInfo, null, errorBody)
      .then(function(response) {
        Should(response.length).equal(0);
      });
    });
  });
  
  describe('Test getting all of the stories in a single request ->', function() {
    var jiraResponse = {};
  
    beforeEach(function() {
      sandbox.stub(Rest, 'get');
    });
  
    it('Test Getting an single set of Jira Issues', function() {
      Rest.get.resolves({ data: SINGLEJIRARESPOSE, response: jiraResponse })
  
      return jira.loadRawData(DEMANDINFO, processingInfo, null, errorBody)
      .then(function(response) {
        Should(response.length).equal(1);
      });
    });
  });
  
  describe('Jira GetRawData - Test error paths retriving issues ->', function() {
    var aSetOfInfo = {};
  
    beforeEach(function() {
      sandbox.stub(Rest, 'get').rejects(ERRORRESULT);
    });
    
    it('Make sure the error is returned', function() {
      return jira.loadRawData(DEMANDINFO, aSetOfInfo, SINCETIME)
        .then(function() {
          Should.ok(false);
        }).catch ( function(error) {
          logger.debug(error);
          Should(error).deepEqual(ERRORRESULT);
        });
    });
  });
  
  describe('Jira testDemand() ->', () => {  
    const aProject = {
      name: 'Test Project',
      demand: {
        flow: [{ name: 'Backlog' }],
        source: 'Jira',
        url: 'http://some.url',
        project: 'Some Jira Project',
        authPolicy: 'Basic',
        userData: 'some secret key',
      }
    };
  
    it('returns an error when the url is invalid.', () => {
      return CO(function* () {
        const project = R.mergeDeepRight(aProject, { demand: { url: 'invalid url' } });
        const result = yield jira.testDemand(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when the jira [project] is an empty string', () => {
      return CO(function* () {
        const project = R.mergeDeepRight(aProject, { demand: { project: '' } });
        const result = yield jira.testDemand(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when the jira [project] is null', () => {
      return CO(function* () {
        const demand = R.omit(['project'], aProject.demand);
        const project = R.mergeDeepRight(R.omit(['demand'], aProject), { demand });
        const result = yield jira.testDemand(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when [authPolicy] is an empty string', () => {
      return CO(function* () {
        const project = R.mergeDeepRight(aProject, { demand: { authPolicy: '' } });
        const result = yield jira.testDemand(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when [authPolicy] is null', () => {
      return CO(function* () {
        const demand = R.omit(['authPolicy'], aProject.demand);
        const project = R.mergeDeepRight(R.omit(['demand'], aProject), { demand });
        const result = yield jira.testDemand(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when [userData] is an empty string', () => {
      return CO(function* () {
        const project = R.mergeDeepRight(aProject, { demand: { userData: '' } });
        const result = yield jira.testDemand(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when [userData] is null', () => {
      return CO(function* () {
        const demand = R.omit(['userData'], aProject.demand);
        const project = R.mergeDeepRight(R.omit(['demand'], aProject), { demand });
        const result = yield jira.testDemand(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when [flow] is an empty array', () => {
      return CO(function* () {
        const project = R.mergeDeepRight(aProject, { demand: { flow: '' } });
        const result = yield jira.testDemand(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns an error when [flow] is null', () => {
      return CO(function* () {
        const demand = R.omit(['flow'], aProject.demand);
        const project = R.mergeDeepRight(R.omit(['demand'], aProject), { demand });
        const result = yield jira.testDemand(project, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  
    it('returns green when the request to Jira is successful', () => {
      return CO(function* () {
        sandbox.stub(Rest, 'get').resolves();
        const result = yield jira.testDemand(aProject, localConstants);
        Should(result.status).equal(localConstants.STATUSOK);
      });
    });

    it('returns red when the request to Jira is successful', () => {
      return CO(function* () {
        sandbox.stub(Rest, 'get').rejects({ });
        const result = yield jira.testDemand(aProject, localConstants);
        Should(result.status).equal(localConstants.STATUSERROR);
      });
    });
  });
})

