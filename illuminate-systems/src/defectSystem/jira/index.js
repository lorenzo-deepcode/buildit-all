const Config = require('config');
const HttpStatus = require('http-status-codes');
const Log4js = require('log4js');
const R = require('ramda');
const ValidUrl = require('valid-url');
const moment = require('moment');
const localConstants = require('../../constants');

const utils = require('../../utils');
const helperClasses = require('../../helperClasses');
const Rest = require('../../restler-as-promise');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.let = Config.get('log-level');



/**
 * Loads raw data from Jira
 * 
 * @param {any} defectInfo 
 * @param {any} processingInfo { dbUrl: string, rawLocation (collectionName): string, storageFunction: fn to post data to db }
 * @param {any} sinceTime start of the Defect 
 * @param {any} errorBody function to transform errors into a common format.
 * @returns Promise with the raw data.
 */
function loadRawData(defectInfo, processingInfo, sinceTime, errorBody) {
  logger.info(`loadBugEntries for ${defectInfo.project} updated since [${sinceTime}]`);

  return new Promise(function (resolve, reject) {
    _loadDefects(defectInfo, [], sinceTime, errorBody)
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

/**
 * Transforms Raw Jira Defect data into the common data format.
 * 
 * @param {any} issueData The raw data from Jira
 * @param {any} systemInformation { initialStatus: string representation of Defect's intial state, i.e. 'CREATED' }
 * @returns transformed data (Common Data Format)
 */
function transformRawToCommon(issueData, systemInformation) {
  logger.info('mapJiraDefect into a common format');

  var commonDataFormat = [];
  var defaultDefectStatus = R.isNil(systemInformation.initialStatus) ? "CREATED" : systemInformation.initialStatus;

  issueData.forEach(function (aDefect) {
    var commonDefectEntry = new helperClasses.CommonDefectEntry(aDefect.id);
    commonDefectEntry.uri = aDefect.self;

    // yes this is a pain in the ass, so feel free to make a better algorithm.
    // essensentially, there is no way to determine the initial priority of a Jira story
    // you do know what it is now.  So look to see if it changed, and if so capture the very first
    // fromString as the initial priority (which is the same a severity for Jira)
    var currentDefectPriority = null;
    aDefect.changelog.histories.forEach(function (history) {
      if (history.items.field === 'priority') {
        if (R.isNil(currentDefectPriority)) {
          currentDefectPriority = history.items.fromString
        }
      }
    });
    if (R.isNil(currentDefectPriority)) {
      currentDefectPriority = aDefect.fields.priority.name;
    }
    var historyEntry = new helperClasses.DefectHistoryEntry(currentDefectPriority, defaultDefectStatus, aDefect.fields.created);

    aDefect.changelog.histories.forEach(function (history) {
      if (history.items.field === 'status') {
        historyEntry.changeDate = history.created;
        commonDefectEntry.history.push(historyEntry);
        historyEntry = new helperClasses.DefectHistoryEntry(currentDefectPriority, history.items.toString, history.created);
      }
      if (history.items.field === 'priority') {
        historyEntry.changeDate = history.created;
        commonDefectEntry.history.push(historyEntry);
        currentDefectPriority = history.items.toString
        historyEntry = new helperClasses.DefectHistoryEntry(currentDefectPriority, historyEntry.statusValue, history.created);
      }
    });
    commonDefectEntry.history.push(historyEntry);
    commonDataFormat.push(commonDefectEntry);
  });

  return commonDataFormat;
}

/**
 * Tests whether the defect data can be read from Jira
 * 
 * @param {any} project as stored in the datastore.
 * @param {any} constants requires { STATUSERROR: '#color', STATUSOK: '#color' }
 * @returns Promise with the status of the connection attempt.
 */
function testDefect(project, constants) {
  logger.info(`testDefect() for JIRA Project ${project.name}`);
  if (!ValidUrl.isUri(project.defect.url)) {
    return Promise.resolve({ status: constants.STATUSERROR, data: utils.validationResponseMessageFormat(`invalid defect URL [${project.defect.url}]`) });
  }

  if (R.isNil(project.defect.project) || R.isEmpty(project.defect.project)) {
    return Promise.resolve({ status: constants.STATUSERROR, data: utils.validationResponseMessageFormat(`[Project] must be a valid Jira project name`) });
  }

  if (R.isNil(project.defect.authPolicy) || R.isEmpty(project.defect.authPolicy)) {
    return Promise.resolve({ status: constants.STATUSERROR, data: utils.validationResponseMessageFormat(`[Auth Policy] must be filled out`) });
  }

  if (R.isNil(project.defect.userData) || R.isEmpty(project.defect.userData)) {
    return Promise.resolve({ status: constants.STATUSERROR, data: utils.validationResponseMessageFormat(`[User Data] must be filled out`) });
  }

  if (R.isNil(project.defect.severity) || R.isEmpty(project.defect.severity)) {
    return Promise.resolve({ status: constants.STATUSERROR, data: utils.validationResponseMessageFormat(`Missing [Servity] information`) });
  }

  return Rest.get(
    project.defect.url + _buildJQL(project.defect.project, 0, moment().format('YYYY-MM-DD')),
    {headers: utils.createBasicAuthHeader(project.defect.userData)}
  ).then(() => ({ status: constants.STATUSOK }))
  .catch((error) => {
    utils.logHttpError(logger, error);
    return ({ status: constants.STATUSERROR, data: error.data });
  });
}

function _buildJQL(project, startPosition, since) {
  const expand = ['changelog', 'history', 'items'];
  const fields = ['issuetype', 'created', 'updated', 'status', 'key', 'summary'];
  const jqlData = `search?jql=project=${project} AND issueType=${localConstants.JIRADEFECTTYPE} AND updated>=${since}`;
  const queryString = `${jqlData}&startAt=${startPosition}&expand=${expand.toString()}&fields=${fields.toString()}`;

  logger.debug(`queryString:[${queryString}]`);
  return queryString;
}

function _loadDefects (defectInfo, issuesSoFar, sinceTime, errorBody) {
  logger.info(`loadJiraDefects() for JIRA project ${defectInfo.project}.  Start Pos ${issuesSoFar.length}`);

  if (!(ValidUrl.isUri(defectInfo.url))) {
    return Promise.reject(errorBody(HttpStatus.BAD_REQUEST, `invalid defect URL [${defectInfo.url}]`));
  }

  return Rest.get(
    defectInfo.url + _buildJQL(defectInfo.project, issuesSoFar.length, sinceTime),
    {headers: utils.createBasicAuthHeader(defectInfo.userData)}
  ).then(({ data }) => {
    logger.info(`Success reading demand from [${data.startAt}] count [${data.issues.length}] of [${data.total}]`);

    var issues = issuesSoFar.concat(data.issues);
    if ((data.issues.length > 0) && (issues.length < data.total)) {
      _loadDefects(defectInfo, issues, sinceTime, errorBody)
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
function _fixHistoryData(stories) {
  logger.info(`fixHistoryData for ${stories.length} stories`);

  stories.forEach(function (aStory) {
    aStory['_id'] = aStory.id;
    aStory.changelog.histories.forEach(function (history) {
      history.items = R.clone(history.items[0]);
    });
  });

  return(stories);
}

module.exports = {
  loadRawData,
  transformRawToCommon,
  testDefect,
}
