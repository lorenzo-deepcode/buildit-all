const Config = require('config');
const Log4js = require('log4js');
const R = require('ramda');
const moment = require('moment');
const ValidUrl = require('valid-url');

const Rest = require('../../restler-as-promise');
const localConstants = require('../../constants');
const utils = require('../../utils');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');



//const MILLENIUM = '2000-01-01';
//const DEFAULTSTARTDATE = MILLENIUM+'+00:00';

function loadRawData(effortInfo, processingInfo, sinceTime, errorBody) {
  logger.info(`loadRawData for ${effortInfo.project} updated since [${sinceTime}]`);
  logger.debug(`processing Instructions`);
  logger.debug(processingInfo);

  return new Promise(function (resolve, reject) {
    _getTimeEntries(effortInfo, sinceTime, errorBody)
      .then(function (timeData) {
        if (timeData.length < 1) {
          resolve(timeData);
        }
        logger.debug(`total time entries - ${timeData.length}`);
        _getTaskEntries(effortInfo, errorBody)
          .then(function (taskData) {
            _replaceTaskIdwithName(timeData, taskData);
            processingInfo.storageFunction(processingInfo.dbUrl, processingInfo.rawLocation, timeData)
            .then (function (allRawData) {
              resolve(allRawData); // return the number of records
            });
          })
          .catch(function (reason) {
            logger.error('loadRawData - ERROR');
            reject(reason);
          });
      })
      .catch(function (reason) {
        reject(reason);
      });
  });
}

function transformRawToCommon(timeData) {
  logger.info('mapHarvestEffort');

  return R.map(_makeCommon, timeData);
}

function testEffort(project, constants) {
  logger.debug(`Harvest -> testEffort() for ${project.name}`);
  if (!ValidUrl.isUri(project.effort.url)) {
    logger.debug(`ERROR, invalid url: ${project.effort.url} on project ${project.name}`)
    return Promise.resolve({ status: constants.STATUSERROR, data: utils.validationResponseMessageFormat(`invalid effort URL [${project.effort.url}])`) });
  }
  
  if (R.isNil(project.effort.project) || R.isEmpty(project.effort.project)) {
    return Promise.resolve({ status: constants.STATUSERROR, data: utils.validationResponseMessageFormat(`[Project] must be a valid Harvest project name`) });
  }
  
  if (R.isNil(project.effort.authPolicy) || R.isEmpty(project.effort.authPolicy)) {
    return Promise.resolve({ status: constants.STATUSERROR, data: utils.validationResponseMessageFormat(`[Auth Policy] must be filled out`) });
  }
  
  if (R.isNil(project.effort.userData) || R.isEmpty(project.effort.userData)) {
    return Promise.resolve({ status: constants.STATUSERROR, data: utils.validationResponseMessageFormat(`[User Data] must be filled out`) });
  }
  
  if (R.isNil(project.effort.role) || R.isEmpty(project.effort.role)) {
    return Promise.resolve({ status: constants.STATUSERROR, data: utils.validationResponseMessageFormat(`Missing [Role] information`) });
  }
  
  var harvestURL = `${project.effort.url}/projects/${project.effort.project}/entries?from=${localConstants.DEFAULTSTARTDATE}&to=${_dateFormatIWant()}&updated_since=${moment().toISOString()}`;
  
  return Rest.get(
    encodeURI(harvestURL),
    {headers: utils.createBasicAuthHeader(project.effort.userData)}
  ).then(() => ({ status: constants.STATUSOK }))
  .catch((error) => {
    utils.logHttpError(logger, error);
    return ({ status: constants.STATUSERROR, data: error.data });
  });
}

function _makeCommon({day_entry}) {
  return {
    day: day_entry.spent_at,
    role: day_entry.task_name,
    effort: day_entry.hours
  }
}


function _getTimeEntries (effortInfo, startDate, errorBody) {
  logger.info(`getTimeEntries since ${startDate}`);

  var harvestURL = `${effortInfo.url}/projects/${effortInfo.project}/entries?from=${localConstants.DEFAULTSTARTDATE}&to=${_dateFormatIWant()}&updated_since=${startDate}+00:00`;
  logger.debug(`getTimeEntries->harvestURL ${harvestURL}`);
  return Rest.get(
    encodeURI(harvestURL),
    {headers: utils.createBasicAuthHeader(effortInfo.userData)}
  ).then(({ data}) => {
    if (data.length < 1) {
      logger.debug('no time entires available');
      return [];
    } else {
      logger.debug(`time entries retrieved - ${data.length}`);
      return data;
    }
  }).catch((error) => {
    utils.logHttpError(logger, error)
    if (error.response && error.response.statusCode) {
      return Promise.reject(errorBody(error.response.statusCode, 'Error retrieving time entries from Harvest'));
    }
    return Promise.reject(error);
  });
}

function _getTaskEntries(effortInfo, errorBody) {
  logger.info('getTaskEntries');

  var harvestURL = `${effortInfo.url}/tasks`;
  logger.debug(`getTaskEntries->harvestURL ${harvestURL}`);
  return Rest.get(harvestURL, {headers: utils.createBasicAuthHeader(effortInfo.userData)})
  .then(({ data }) => {
    if (data.length < 1) {
      logger.debug('no task entires available');
      return [];
    }
    logger.debug(`task entries retrieved - ${data.length}`);
    const availableTasks = {};
    data.forEach(function(aTask) {
      availableTasks[aTask.task.id] = aTask.task.name;
    });
    return availableTasks;
  }).catch((error) => {
    utils.logHttpError(logger, error)
    if (error.response && error.response.statusCode) {
      return Promise.reject(errorBody(error.response.statusCode, 'Error retrieving task entries from Harvest'));
    }
    return Promise.reject(error);
  });
}

function _replaceTaskIdwithName(timeData, taskData) {
  logger.info('replaceTaskIdwithName');

  timeData.forEach(function(aTimeEntry) {
    aTimeEntry['_id'] = aTimeEntry.day_entry.id;
    aTimeEntry.day_entry['task_name'] = taskData[aTimeEntry.day_entry.task_id];
  });
}


function _dateFormatIWant() {
  return moment.utc().format('YYYY-MM-DD');
}

module.exports = {
  loadRawData,
  transformRawToCommon,
  testEffort
}
