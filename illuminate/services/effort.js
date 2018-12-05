'use strict'

const Config = require('config');
const constants = require('../util/constants');
const illuminateSystems = require('@buildit/illuminate-systems');
const harvest = illuminateSystems.effort.harvest;
const Log4js = require('log4js');
const R = require('ramda');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

// effortInfo = {
//   source: "Excel",
//   url: "",
//   project: "TestData1",
//   authPolicy: "None",
//   userData: "",
//   role: [
//       {name: "PM", groupWith: "BA"},
//       {name: "BA", groupWith: "PM"},
//       {name: "SD", groupWith: null}
//     ]};

exports.configureProcessingInstructions = function(processingInfo) {
  var updatedInfo = R.clone(processingInfo);
  updatedInfo.rawLocation = constants.RAWEFFORT;
  updatedInfo.commonLocation = constants.COMMONEFFORT;
  updatedInfo.summaryLocation = constants.SUMMARYEFFORT;
  updatedInfo.eventSection = constants.EFFORTSECTION;
  return updatedInfo;
}

exports.rawDataProcessor = function(effortData) {
  if (R.isNil(effortData) || R.isEmpty(effortData)) {
    logger.debug('UNKNOWN EFFORT SYSTEM ');
    logger.debug(effortData);
    return null;
  } else {
    switch(effortData.source.toUpperCase()) {
        case "HARVEST":
          return harvest;
        default:
          return null;
    }
  }
}

/* eslint-disable no-unused-vars */
exports.transformCommonToSummary = function(commonData, processingInstructions) {
  return createSummaryData(commonData);
}
/* eslint-enable no-unused-vars */

const createSummaryData = data => {
    const objectResult = data.reduce((result, point) => {
        if (!result[point.day]) result[point.day] = { activity: {} }
        if (result[point.day].activity[point['role']]) {
            result[point.day].activity[point['role']] =
                result[point.day].activity[point['role']] + point['effort']
        } else {
            result[point.day].activity[point['role']] = point['effort']
        }
        return result
    }, {})
    return Object.keys(objectResult).map(date => ({
        projectDate: date,
        activity: objectResult[date].activity
    }))
};
