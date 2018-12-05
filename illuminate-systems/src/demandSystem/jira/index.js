const Config = require('config');
const HttpStatus = require('http-status-codes');
const Log4js = require('log4js');
const R = require('ramda');
const ValidUrl = require('valid-url');
const moment = require('moment');

const utils = require('../../utils')
const localConstants = require('../../constants');
const helperClasses = require('../../helperClasses');
const Rest = require('../../restler-as-promise');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

/**
 * 
 * 
 * @param {any} demandInfo The demand section of a project from the datastore.
 * @param {any} processingInfo { dbUrl: string, rawLocation (collectionName): string, storageFunction: fn to post data to db }
 * @param {any} sinceTime start of the Defect 
 * @param {any} errorBody function to transform errors into a common format.
 * @returns Promise with the raw data.
 */
function loadRawData(demandInfo, processingInfo, sinceTime, errorBody) {
  logger.info(`loadStoryEntries for ${demandInfo.project} updated since [${sinceTime}]`);

  return new Promise(function (resolve, reject) {
    _loadDemand(demandInfo, [], sinceTime, errorBody)
    .then( function (stories) {
      logger.debug(`total stories read - ${stories.length}`);
      if (stories.length < 1) {
        resolve(stories);
      }

      var enhancedStories = _fixHistoryData(stories);
      processingInfo.storageFunction(processingInfo.dbUrl, processingInfo.rawLocation, enhancedStories)
      .then (function (allRawData) {
        resolve(allRawData);
      })
      .catch(function (reason) {
        reject(reason);
      });

    })
    .catch( function(reason) {
      reject(reason);
    });
  });
}

function transformRawToCommon(issueData, systemInformation) {
  logger.info('mapJiraDemand into a common format');

  var commonDataFormat = [];

  issueData.forEach(function (aStory) {
    var commonDemandEntry = new helperClasses.CommonDemandEntry(aStory.id);
    commonDemandEntry.uri = aStory.self;
    var historyEntry = new helperClasses.DemandHistoryEntry(systemInformation.flow[0].name, aStory.fields.created);

    aStory.changelog.histories.forEach(function (history) {
      if (history.items.field === 'status' || history.items.field === 'resolution') {
        historyEntry.changeDate = history.created;
        commonDemandEntry.history.push(historyEntry);

        // if this is a resolution status change where the item was moved from the resolved state
        // there is no indication of the new state.  So this just assumes the issue is in the most
        // recent previous state.  One hopes that there is never a case where an issue is created
        // in a resolved state, but I think the code will work anyway.
        if (R.isNil(history.items.toString)) {
          var index = (commonDemandEntry.history.length < 2) ? 0 : commonDemandEntry.history.length - 2
          historyEntry = new helperClasses.DemandHistoryEntry(commonDemandEntry.history[index].statusValue, history.created);
        } else {
          historyEntry = new helperClasses.DemandHistoryEntry(history.items.toString, history.created);
        }
      } else if (history.items.field === 'Fix Version') {
        // this really isn't a status change per se, but a release event.
        // this just gives the resolution status a valid end date.
        // this item will be dropped at this point in the summary data.
        historyEntry.changeDate = history.created;
        commonDemandEntry.history.push(historyEntry);
        historyEntry = new helperClasses.DemandHistoryEntry(history.items.field + '-' + history.items.toString, history.created);
      }
    });
    commonDemandEntry.history.push(historyEntry);
    commonDataFormat.push(commonDemandEntry);
  });

  return commonDataFormat;
}

function testDemand(project, constants) {
  logger.info(`testDemand() for JIRA Project ${project.name}`);
  if (!ValidUrl.isUri(project.demand.url)) {
    return Promise.resolve({ status: constants.STATUSERROR, data: utils.validationResponseMessageFormat(`invalid demand URL [${project.demand.url}]`) });
  }

  if (R.isNil(project.demand.project) || R.isEmpty(project.demand.project)) {
    return Promise.resolve({ status: constants.STATUSERROR, data: utils.validationResponseMessageFormat(`[Project] must be a valid Jira project name`) });
  }

  if (R.isNil(project.demand.authPolicy) || R.isEmpty(project.demand.authPolicy)) {
    return Promise.resolve({ status: constants.STATUSERROR, data: utils.validationResponseMessageFormat(`[Auth Policy] must be filled out`) });
  }

  if (R.isNil(project.demand.userData) || R.isEmpty(project.demand.userData)) {
    return Promise.resolve({ status: constants.STATUSERROR, data: utils.validationResponseMessageFormat(`[User Data] must be filled out`) });
  }

  if (R.isNil(project.demand.flow) || R.isEmpty(project.demand.flow)) {
    return Promise.resolve({ status: constants.STATUSERROR, data: utils.validationResponseMessageFormat(`Missing [Flow] information`) });
  }

  return Rest.get(
    project.demand.url + _buildJQL(project.demand.project, 0, moment().format('YYYY-MM-DD'), constants),
    {headers: utils.createBasicAuthHeader(project.demand.userData)}
  ).then(() => ({ status: constants.STATUSOK }))
  .catch((error) => {
    utils.logHttpError(logger, error);
    return ({ status: constants.STATUSERROR, data: error.data });
  });
}

function _loadDemand(demandInfo, issuesSoFar, sinceTime, errorBody) {
  logger.info(`loadDemand() for JIRA project ${demandInfo.project}.  Start Pos ${issuesSoFar.length}`);

  if (!(ValidUrl.isUri(demandInfo.url))) {
    return Promise.reject(errorBody(HttpStatus.BAD_REQUEST, `invalid demand URL [${demandInfo.url}]`));
  }

  return Rest.get(
    demandInfo.url + _buildJQL(demandInfo.project, issuesSoFar.length, sinceTime),
    {headers: utils.createBasicAuthHeader(demandInfo.userData)}
  ).then(({ data }) => {
    logger.info(`Success reading demand from [${data.startAt}] count [${data.issues.length}] of [${data.total}]`);
    var issues = issuesSoFar.concat(data.issues);
    if ((data.issues && data.issues.length > 0) && (issues.length < data.total)) {
      _loadDemand(demandInfo, issues, sinceTime, errorBody)
      .then( function(issues) {  // unwind the promise chain
        return issues;
      })
    } else {
      return issues;
    }
  }).catch((error) => {
    utils.logHttpError(logger, error)
    if (error.response && error.response.statusCode) {
      return Promise.reject(errorBody(error.response.statusCode, 'Error retrieving stories from Jira'));
    }
    return Promise.reject(error);
  });
}

// Just what the heck is going on here?
// For whatever reason, when I searialze a Jira Issue,
// the history item array turns into [Object] which isn't helpful at all
// given that the array is always contains 1 element this essentially
// turns the array of 1 element into an object so that it can be stored "correctly"
function _fixHistoryData (stories) {
  logger.info(`fixHistoryData for ${stories.length} stories`);

  stories.forEach(function (aStory) {
    aStory['_id'] = aStory.id;
    aStory.changelog.histories.forEach(function (history) {
      history.items = R.clone(history.items[0]);
    });
  });

  return(stories);
}

function _buildJQL(project, startPosition, since) {
  const expand = ['changelog', 'history', 'items'];
  const fields = ['issuetype', 'created', 'updated', 'status', 'key', 'summary'];
  const jqlData = `search?jql=project=${project} AND issueType=${localConstants.JIRADEMANDTYPE} AND updated>=${since}`;
  const queryString = `${jqlData}&startAt=${startPosition}&expand=${expand.toString()}&fields=${fields.toString()}`;

  logger.debug(`queryString:[${queryString}]`);
  return queryString;
}

module.exports = {
  loadRawData,
  transformRawToCommon,
  testDemand,
}