'use strict'

const Config = require('config');
const constants = require('../../util/constants');
const dataStore = require('../datastore/mongodb');
const dataLoader = require('../dataLoader');
const errorHelper = require('../errors');
const HttpStatus = require('http-status-codes');
const Log4js = require('log4js');
const Moment = require('moment');
const myConstants = require('../../util/constants');
const R = require('ramda');
const utils = require('../../util/utils');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');``

exports.listEvents = function (req, res) {
  var projectName = decodeURIComponent(req.params.name);
  logger.info(`listEvents for ${projectName}`);

  dataStore.getAllData(utils.dbProjectPath(projectName), myConstants.EVENTCOLLECTION)
    .then ( function(eventData) {
      logger.debug('listEvents->eventData');
      logger.debug(eventData);
      if (eventData.length < 1) {
        logger.debug("listEvents -> Not Found");
        res.status(HttpStatus.NOT_FOUND);
        res.send(errorHelper.errorBody(HttpStatus.NOT_FOUND, `Unable to find events for ${projectName}`));
      } else {
        res.status(HttpStatus.OK);
        res.send(eventData);
      }
    }).catch(function(err) {
      logger.debug("listEvents -> ERROR");
      logger.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      res.send(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to find events for ' + projectName));
    });
};

exports.listAnEvent = function (req, res) {
  var projectName = decodeURIComponent(req.params.name);
  var eventId = decodeURIComponent(req.params.id);
  logger.info(`list an event [${eventId}] for ${projectName}`);

  dataStore.getDocumentByID(utils.dbProjectPath(projectName), myConstants.EVENTCOLLECTION, eventId)
    .then ( function(eventData) {
      if (eventData === undefined) {
        logger.debug("listAnEvent -> Not Found");
        res.status(HttpStatus.NOT_FOUND);
        res.send(errorHelper.errorBody(HttpStatus.NOT_FOUND, `Unable to find event [${eventId}]`));
      } else {
        res.status(HttpStatus.OK);
        res.send(eventData);
      }
    }).catch(function(err) {
      logger.debug("listAnEvent -> ERROR");
      logger.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      res.send(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to find events for ' + projectName));
    });
};

const isActiveEvent = (anEvent) => R.isNil(anEvent.endTime);
const isValidEventType = (eventType) => R.not(R.isNil(eventType)) && R.contains(R.toUpper(eventType), [myConstants.LOADEVENT, myConstants.UPDATEEVENT, myConstants.REPROCESSEVENT]);
const isOverrideEvent = (queryParm) => R.not(R.isNil(queryParm)) && R.equals(R.toUpper(queryParm), 'TRUE');

exports.createNewEvent = function (req, res) {
  var projectName = decodeURIComponent(req.params.name);
  logger.info(`createNewEvent for ${projectName} params:[${req.query}]`);
  var aNewEvent = {};
  var overrideOpenEvent = false;

  if (isOverrideEvent(req.query.override)) {
    logger.debug(`Forced override of event creation request.`);
    overrideOpenEvent = true;
  }

  if (!isValidEventType(req.query.type)) {
    logger.debug(`Missing or invalid type query parameter`);
    res.status(HttpStatus.BAD_REQUEST);
    res.send(errorHelper.errorBody(HttpStatus.BAD_REQUEST,
      `Query Parameter "type" must be specified.  Must either be ${myConstants.LOADEVENT}, ${myConstants.UPDATEEVENT}, or ${myConstants.REPROCESSEVENT}`));
  } else {
    getProjectData(projectName)
      .then (function(aProject) {
        module.exports.getMostRecentEvent(projectName)
          .then (function(anEvent) {
            if (R.not(R.isNil(anEvent)) && isActiveEvent(anEvent) && overrideOpenEvent) {
              anEvent.status = constants.FAILEDEVENT;
              anEvent.note = constants.FORCEDCLOSEDMESSAGE;
              anEvent.endTime = Moment.utc().format();
              dataStore.upsertData(utils.dbProjectPath(projectName), constants.EVENTCOLLECTION, [anEvent])
                .then (function () {
                  logger.debug(`createNewEvent->Event [${anEvent._id}] forced complete.`);
                }).catch (function () {
                  logger.debug(`createNewEvent->Error trying to override open event ${anEvent._id}`);
                  anEvent.endTime = null;
                });
            }

            if (R.not(R.isNil(anEvent)) && isActiveEvent(anEvent)) {
              var url = `${req.protocol}://${req.hostname}${req.baseUrl}${req.path}/${anEvent._id}`;
              logger.debug(`createNewEvent -> There is an existing active event ${url}`);
              logger.debug(anEvent);
              res.status(HttpStatus.CONFLICT);
              res.send(errorHelper.errorBody(HttpStatus.CONFLICT,
                `There is currently an active event for this project, please wait for it to complete.  ${url}`));
            } else {
              aNewEvent = new utils.DataEvent(req.query.type.toUpperCase());
              logger.debug('createNewEvent -> NO ACTIVE EVENTS');
              logger.debug(aNewEvent);
              if ((anEvent != undefined) && (req.query.type.toUpperCase() === myConstants.UPDATEEVENT)) {
                logger.debug('createNewEvent -> Create an Update Event');
                aNewEvent.since = utils.dateFormatIWant(anEvent.endTime);
                logger.debug(aNewEvent);
              }
              configureLoadEventSystems(aProject, aNewEvent);
              dataStore.insertData(utils.dbProjectPath(projectName), myConstants.EVENTCOLLECTION, [aNewEvent])
                .then ( function(result) {
                  if (result.insertedCount > 0) {
                    if (aNewEvent.status != constants.PENDINGEVENT) {
                      logger.debug(`createNewEvent -> error configuring event for ${projectName}.`);
                      logger.debug(aNewEvent);
                      res.status(HttpStatus.CONFLICT);
                      res.send(errorHelper.errorBody(HttpStatus.CONFLICT,
                        `Unable to fulill load request ${projectName}.  Verify configuration of Demand, Defect, and Effort systems.`));
                    } else {
                      res.status(HttpStatus.CREATED);
                      var tmpBody = {url: `${req.protocol}://${req.hostname}${req.baseUrl}${req.path}/${aNewEvent._id}`};
                      logger.debug("createNewEvent -> Created @ " + tmpBody.url);
                      res.send(tmpBody);
                      dataLoader.processProjectData(aProject, aNewEvent);  // NOW GO DO WORK
                    }
                  } else {
                    logger.debug("createNewEvent -> Event was not created " + projectName);
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                    res.send(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to find create event for ' + projectName));
                  }
                }).catch(function(err) {
                  logger.debug("createNewEvent -> ERROR 1");
                  logger.error(err);
                  res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                  res.send(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, 'Unable to find events for ' + projectName));
                });
              }
          }).catch(function(err) {
            logger.debug("createNewEvent -> ERROR 2");
            if (err != undefined) {
              logger.error(err);
            }
            res.status(HttpStatus.NOT_FOUND);
            res.send(errorHelper.errorBody(HttpStatus.NOT_FOUND, 'Unable to find project information for ' + projectName));
          });
        }).catch(function(err) {
          logger.debug("createNewEvent -> ERROR 3");
          if (err != undefined) {
            logger.error(err);
          }
          res.status(HttpStatus.NOT_FOUND);
          res.send(errorHelper.errorBody(HttpStatus.NOT_FOUND, 'Unable to find project information for ' + projectName));
        });
  }
};

const systemDefinitionExists = (aSystemDeffiniton) =>
  (R.not(R.isNil(aSystemDeffiniton)) &&
  R.not(R.isEmpty(aSystemDeffiniton)) &&
  R.not(R.isNil(aSystemDeffiniton.source)) &&
  R.not(R.isNil(aSystemDeffiniton.url)));


// okay - here is a pessamistic view - set up for failure
// allow for success
function configureLoadEventSystems(aProject, anEvent) {
  anEvent.status = constants.FAILEDEVENT;
  anEvent.endTime = Moment.utc().format();
  anEvent.note = 'No Demand, Defect, or Effort system configure for this project';
  if (systemDefinitionExists(aProject.demand)) {
      anEvent.demand = {};
      anEvent.status = constants.PENDINGEVENT;
      anEvent.endTime = null;
      anEvent.note = '';
  }
  if (systemDefinitionExists(aProject.defect)) {
      anEvent.defect = {};
      anEvent.status = constants.PENDINGEVENT;
      anEvent.endTime = null;
      anEvent.note = '';
  }
  if (systemDefinitionExists(aProject.effort)) {
      anEvent.effort = {};
      anEvent.status = constants.PENDINGEVENT;
      anEvent.endTime = null;
      anEvent.note = '';
  }
}

function getProjectData(aProjectName) {
  logger.debug('loadEvent->getProjectData');

  return new Promise(function (resolve, reject) {
      dataStore.getDocumentByName(utils.dbCorePath(), myConstants.PROJECTCOLLECTION, aProjectName)
        .then ( function(aProject) {
          if (aProject === undefined) {
            logger.debug("getProjectData -> Not Found");
            reject(aProject);
          } else {
            resolve(aProject)
          }
        }).catch(function(err) {
          logger.debug("getProjectData -> ERROR");
          logger.error(err);
          reject(err);
        });
  });
}

var dateSort = function(a, b) { return (Moment.utc(a.startTime) - Moment.utc(b.startTime)); };

exports.getMostRecentEvent = function (aProjectName) {
  logger.debug(`loadEvent->getMostRecentEvent for ${aProjectName}`);

  return new Promise(function (resolve, reject) {
      dataStore.getAllData(utils.dbProjectPath(aProjectName), myConstants.EVENTCOLLECTION)
        .then ( function(allEvents) {
          if (allEvents.length < 1) {
            logger.debug('loadEvent->getMostRecentEvent - Not Found');
            resolve(null);
          } else {
            logger.debug(`loadEvent->getMostRecentEvent - ${allEvents.length} events found`);
            var orderedEvents = R.sort(dateSort, allEvents);
            resolve (R.last(orderedEvents));
          }
        }).catch(function(err) {
          logger.debug("loadEvent->getMostRecentEvent - ERROR");
          logger.error(err);
          reject(err);
        });
  });
}
