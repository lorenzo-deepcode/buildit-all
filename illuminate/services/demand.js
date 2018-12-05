'use strict'

const Config = require('config');
const constants = require('../util/constants');
const illuminateSystems = require('@buildit/illuminate-systems');
const jira = illuminateSystems.demand.jira;
const trello = illuminateSystems.demand.trello;
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
  updatedInfo.rawLocation = constants.RAWDEMAND;
  updatedInfo.commonLocation = constants.COMMONDEMAND;
  updatedInfo.summaryLocation = constants.SUMMARYDEMAND;
  updatedInfo.eventSection = constants.DEMANDSECTION;
  return updatedInfo;
}

exports.rawDataProcessor = function(demandData) {
  if (R.isNil(demandData) || R.isEmpty(demandData)) {
    logger.debug('UNKNOWN DEMAND SYSTEM ');
    logger.debug(demandData);
    return null;
  } else {
    switch(demandData.source.toUpperCase()) {
        case 'JIRA':
          return jira;
        case 'TRELLO':
          return trello;
        default:
          return null;
    }
  }
}


exports.transformCommonToSummary = function(commonData, processingInstructions) {
  logger.info(`mapCommonDataToSummary for ${commonData.length} records`);

  var datedData = [];

  commonData.forEach(function (aHistoryItem) {
    aHistoryItem.history.forEach(function (aStatusChange) {
      if (!aStatusChange.statusValue.startsWith(constants.JIRARELEASEFIELD)) {
        var endDate = (R.isNil(aStatusChange.changeDate)) ? processingInstructions.endDate : aStatusChange.changeDate;
        var daysDifference = utils.createDayArray(aStatusChange.startDate, endDate);

        for (var i = 0; i < daysDifference.length; i++) {
          if (!(daysDifference[i] in datedData)) {
            datedData.push(daysDifference[i]);
            datedData[daysDifference[i]] = {};
          }
          var temp = datedData[daysDifference[i]];
          if (!(aStatusChange.statusValue in temp)) {
            temp[aStatusChange.statusValue] = 0;
          }
          temp[aStatusChange.statusValue]++;
        }
      }
    });
  });

  var demandStatusByDay = [];
  datedData.forEach(function (aDayInTime) {
    var statusSummary = datedData[aDayInTime];
    var datedStatus = {projectDate: aDayInTime, status: statusSummary};
    demandStatusByDay.push(datedStatus);
  });

  return demandStatusByDay;
}
