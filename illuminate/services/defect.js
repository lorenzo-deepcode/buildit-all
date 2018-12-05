'use strict'

const Config = require('config');
const constants = require('../util/constants');
const illuminateSystems = require('@buildit/illuminate-systems');
const jira = illuminateSystems.defect.jira;
const Log4js = require('log4js');
const utils = require('../util/utils');
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
  updatedInfo.rawLocation = constants.RAWDEFECT;
  updatedInfo.commonLocation = constants.COMMONDEFECT;
  updatedInfo.summaryLocation = constants.SUMMARYDEFECT;
  updatedInfo.eventSection = constants.DEFECTSECTION;
  logger.debug(`configured demand proceessing info ${JSON.stringify(updatedInfo)}`);
  return updatedInfo;
}

exports.rawDataProcessor = function(defectData) {
  if (R.isNil(defectData) || R.isEmpty(defectData)) {
    logger.debug('UNKNOWN DEMAND SYSTEM ');
    logger.debug(defectData);
    return null;
  } else {
    switch(defectData.source.toUpperCase()) {
        case 'JIRA':
          return jira;
        default:
          return null;
    }
  }
}


exports.transformCommonToSummary = function(commonData, processingInstructions) {
  logger.info(`mapCommonDataToSummary for ${commonData.length} records`);

  //defense
  var resolvedStatus = R.isNil(processingInstructions.resolvedStatus) ? constants.DEFAULTDEFECTRESOLVEDSTATE.toUpperCase() : processingInstructions.resolvedStatus.toUpperCase();
  var datedData = [];

  commonData.forEach(function (defectSummary) {
    defectSummary.history.forEach(function (aChange) {
      if (aChange.statusValue.toUpperCase() != resolvedStatus) { // don't track resolved defects
        var endDate = (R.isNil(aChange.changeDate)) ? processingInstructions.endDate : aChange.changeDate;
        var daysDifference = utils.createDayArray(aChange.startDate, endDate);
        for (var i = 0; i < daysDifference.length; i++) {
          if (!(daysDifference[i] in datedData)) {
            datedData.push(daysDifference[i]);
            datedData[daysDifference[i]] = {};
          }
          var temp = datedData[daysDifference[i]];
          if (!(aChange.severity in temp)) {
            temp[aChange.severity] = 0;
          }
          temp[aChange.severity]++;
        }
      }
    });
  });

  var defectSeverityByDay = [];
  datedData.forEach(function (aDayInTime) {
    var severitySummary = datedData[aDayInTime];
    var datedSeverity = {projectDate: aDayInTime, severity: severitySummary};
    defectSeverityByDay.push(datedSeverity);
  });

  return defectSeverityByDay;
}
