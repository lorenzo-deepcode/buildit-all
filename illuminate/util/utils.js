'use strict'

const Config = require('config');
const constants = require('./constants');
const Moment = require('moment');
const R = require('ramda');
const UUID = require('uuid');

const Log4js = require('log4js');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

exports.dbProjectPath = function (projectName) {
  var dbUrl = `${Config.get('datastore.dbUrl')}/${Config.get('datastore.context')}-${projectName.replace(/\W/g, '')}`;
  return dbUrl;
};

exports.dbCorePath = function () {
  return this.dbProjectPath(Config.get('datastore.rootDB'));
};

function generateRootServiceUrl () {
  var url = `http://${Config.get('server.url')}:${Config.get('server.port')}/v1/project`;
  return url;
}

exports.generateServiceUrl = function (projectName) {
  var url = `${generateRootServiceUrl()}/${encodeURIComponent(projectName)}`;
  return url;
};

exports.generateServiceUrlWithQuery = function (queryString) {
  var url = `${generateRootServiceUrl()}?${queryString}`;
  return url;
};

exports.generatePortlessServiceUrl = function (projectName) {
  var url = `http://${Config.get('server.url')}/v1/project/${encodeURIComponent(projectName)}`;
  return url;
};

exports.createBasicAuthHeader = function(encodedUser) {
  var headers = {
    'Authorization': 'Basic ' +  encodedUser,
    'Accept':'application/json',
    'Content-Type':'application/json'};
  return headers;
}

exports.dateFormatIWant = function (incomming) {
  if (R.isNil(incomming) || R.isEmpty(incomming)) {
    return Moment.utc().format(constants.DBDATEFORMAT)
  } else {
    return Moment.utc(incomming).format(constants.DBDATEFORMAT);
  }
};

exports.createDayArray = function (start, end) {

  var daysArray = [];
  

  if (R.isNil(start)) {
    return daysArray;
  }
  if (R.isNil(end)) {
    return daysArray;
  }

  var startDate = Moment.utc(Moment.utc(start).format(constants.DBDATEFORMAT));
  var endDate = Moment.utc(Moment.utc(end).format(constants.DBDATEFORMAT));

  if (startDate.dayOfYear() === endDate.dayOfYear()) {
    return daysArray;
  }

  for (; startDate < endDate; startDate.add(1, 'd')) {
    daysArray.push(startDate.format(constants.DBDATEFORMAT));
  }

  return daysArray;
};

exports.ProcessingInfo = function (name) {
  this.name = name;
  this.dbUrl = module.exports.dbProjectPath(name);
  this.rawLocation = null;
  this.commonLocation = null;
  this.summaryLocation = null;
  this.eventSection = null;
  this.storageFunction = null;
  this.endDate = null;
}

exports.SystemEvent = function (status, message) {
  this.completion = Moment.utc().format();
  this.status = status;
  this.message = message;
}

exports.DataEvent = function (type) {
  this._id = UUID.v4();
  this.type = type;
  this.startTime = Moment.utc().format();
  this.endTime = null;
  this.since = constants.DEFAULTSTARTDATE;
  this.status = constants.PENDINGEVENT;
  this.note = "";
  this.demand = null;
  this.defect = null;
  this.effort = null;
}

exports.DefectHistoryEntry = function (severity, status, startDate) {
  this.severity = severity;
  this.startDate = startDate;
  this.statusValue = status;
  this.changeDate = null;
}

exports.CommonDefectEntry = function (id) {
  this._id = id;
  this.uri = null;
  this.history = [];
}

exports.DemandHistoryEntry = function (status, startDate) {
  this.statusValue = status;
  this.startDate = startDate;
  this.changeDate = null;
}

exports.CommonDemandEntry = function (id) {
  this._id = id;
  this.uri = null;
  this.history = [];
}

exports.CommonProjectStatusResult = function (name, actual, projected, status, source) {
  return {
    name,
    actual,
    projected,
    status,
    source,
  }
}

exports.pingReponseMessageFormat = function(message) {
  return {
    message,
  };
}
