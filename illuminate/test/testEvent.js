'use strict'

const constants = require('../util/constants');
const testConstants = require('./testConstants');
const utils = require('../util/utils');
const dataStore = require('../services/datastore/mongodb');
const event = require('../services/event');
const projectStatus = require('../services/status');
const statusIndicators = require('../services/statusIndicators');
const Sinon = require('sinon');

const R = require('ramda');
const CO = require('co');
const Should = require('should');
const Config = require('config');
const Log4js = require('log4js');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

describe('Event', () => {
  const sandbox = Sinon.sandbox.create();

  describe('processEventData', () => {

    describe('single system', () => {
      let processingInstructions;
      let anEvent;
      let aSystemEvent;
      let insertedDocument;

      beforeEach('setup', function () {
        sandbox.stub(statusIndicators, 'getStatuses').resolves();
        sandbox.stub(projectStatus, 'updateProjectStatus').resolves();
        processingInstructions = new utils.ProcessingInfo(testConstants.UNITTESTPROJECT);
        processingInstructions.eventSection = constants.EFFORTSECTION;
        anEvent = new utils.DataEvent(constants.LOADEVENT);
        anEvent.effort = {};
        aSystemEvent = new utils.SystemEvent(constants.PENDINGEVENT, '');
        return dataStore.insertData(processingInstructions.dbUrl, constants.EVENTCOLLECTION, [anEvent])
        .then(document => {
          insertedDocument = document.ops[0];
        });
      });

      it('updates the effort in the event', () => {
        return CO(function* () {
          yield event.processEventData()(aSystemEvent, processingInstructions, insertedDocument._id)
          const updatedEvent = yield dataStore.getDocumentByID(processingInstructions.dbUrl, constants.EVENTCOLLECTION, insertedDocument._id);
          Should(aSystemEvent).match(updatedEvent.effort);
        });
      });

      it('sets an end time on the event is complete', () => {
        return CO(function* () {
          yield event.processEventData()(aSystemEvent, processingInstructions, insertedDocument._id)
          const updatedEvent = yield dataStore.getDocumentByID(processingInstructions.dbUrl, constants.EVENTCOLLECTION, insertedDocument._id);
          Should(updatedEvent.endTime).not.null();
        });
      });

      it('does not set an end time on the event is incomplete', () => {
        return CO(function* () {
          // Setting demand as not null so the event is incomplete
          yield dataStore.updateDocumentPart(processingInstructions.dbUrl, constants.EVENTCOLLECTION, insertedDocument._id, constants.DEMANDSECTION, {});

          yield event.processEventData()(aSystemEvent, processingInstructions, insertedDocument._id)
          const updatedEvent = yield dataStore.getDocumentByID(processingInstructions.dbUrl, constants.EVENTCOLLECTION, insertedDocument._id);
          Should(updatedEvent.endTime).is.null();
        });
      });


      it('sets an event as complete', () => {
        return CO(function* () {
          const successfulSystemEvent = R.merge(aSystemEvent, { status: constants.SUCCESSEVENT });
          yield event.processEventData()(successfulSystemEvent, processingInstructions, insertedDocument._id)
          const updatedEvent = yield dataStore.getDocumentByID(processingInstructions.dbUrl, constants.EVENTCOLLECTION, insertedDocument._id);
          Should(updatedEvent.status).equal(constants.SUCCESSEVENT);
        });
      });

      it('sets an event as failure', () => {
        return CO(function* () {
          const successfulSystemEvent = R.merge(aSystemEvent, { status: constants.FAILEDEVENT });
          yield event.processEventData()(successfulSystemEvent, processingInstructions, insertedDocument._id)
          const updatedEvent = yield dataStore.getDocumentByID(processingInstructions.dbUrl, constants.EVENTCOLLECTION, insertedDocument._id)
          Should(updatedEvent.status).equal(constants.FAILEDEVENT);
        });
      });
    });

    describe('multiple systems', () => {
      let processingInstructions;
      let anEvent;
      let anEffortSystemEvent;
      beforeEach('setup', function () {
        sandbox.stub(statusIndicators, 'getStatuses').resolves();
        sandbox.stub(projectStatus, 'updateProjectStatus').resolves();
        processingInstructions = new utils.ProcessingInfo(testConstants.UNITTESTPROJECT);
        processingInstructions.eventSection = constants.EFFORTSECTION;
        anEvent = new utils.DataEvent(constants.LOADEVENT);
      });

      it('does not mark the event as complete if all systems are not complete', () => {
        return CO(function* () {
          anEvent.effort = {};
          anEvent.demand = {};
          anEffortSystemEvent = new utils.SystemEvent(constants.SUCCESSEVENT, '');
          const insertedDocument = (yield dataStore.insertData(processingInstructions.dbUrl, constants.EVENTCOLLECTION, [anEvent])).ops[0]
          yield event.processEventData()(anEffortSystemEvent, processingInstructions, insertedDocument._id)
          const updatedEvent = yield dataStore.getDocumentByID(processingInstructions.dbUrl, constants.EVENTCOLLECTION, insertedDocument._id);
          Should(updatedEvent.endTime).is.null();
        });
      });

      it('marks event.status as success when all systems are completed successfully', () => {
        return CO(function* () {
          anEvent.effort = {};
          anEvent.demand = new utils.SystemEvent(constants.SUCCESSEVENT, '');
          anEffortSystemEvent = new utils.SystemEvent(constants.SUCCESSEVENT, '');
          const insertedDocument = (yield dataStore.insertData(processingInstructions.dbUrl, constants.EVENTCOLLECTION, [anEvent])).ops[0]
          yield event.processEventData()(anEffortSystemEvent, processingInstructions, insertedDocument._id)
          const updatedEvent = yield dataStore.getDocumentByID(processingInstructions.dbUrl, constants.EVENTCOLLECTION, insertedDocument._id);
          Should(updatedEvent.status).match(constants.SUCCESSEVENT);
        });
      });

      it('marks event.status as failed when at least one systems fail', () => {
        return CO(function* () {
          anEvent.effort = {};
          anEvent.demand = new utils.SystemEvent(constants.SUCCESSEVENT, '');
          anEffortSystemEvent = new utils.SystemEvent(constants.FAILEDEVENT, '');
          const insertedDocument = (yield dataStore.insertData(processingInstructions.dbUrl, constants.EVENTCOLLECTION, [anEvent])).ops[0]
          yield event.processEventData()(anEffortSystemEvent, processingInstructions, insertedDocument._id)
          const updatedEvent = yield dataStore.getDocumentByID(processingInstructions.dbUrl, constants.EVENTCOLLECTION, insertedDocument._id);
          Should(updatedEvent.status).match(constants.FAILEDEVENT);
        });
      });

      it('marks event.status as failed when all systems fail', () => {
        return CO(function* () {
          anEvent.effort = {};
          anEvent.demand = new utils.SystemEvent(constants.FAILEDEVENT, '');
          anEffortSystemEvent = new utils.SystemEvent(constants.FAILEDEVENT, '');
          const insertedDocument = (yield dataStore.insertData(processingInstructions.dbUrl, constants.EVENTCOLLECTION, [anEvent])).ops[0]
          yield event.processEventData()(anEffortSystemEvent, processingInstructions, insertedDocument._id)
          const updatedEvent = yield dataStore.getDocumentByID(processingInstructions.dbUrl, constants.EVENTCOLLECTION, insertedDocument._id);
          Should(updatedEvent.status).match(constants.FAILEDEVENT);
        });
      });
    });

    describe('updating event status', () => {
      let processingInstructions;
      let anEvent;
      let aSystemEvent;
      let insertedDocument;

      beforeEach(() => {
        processingInstructions = new utils.ProcessingInfo(testConstants.UNITTESTPROJECT);
        processingInstructions.eventSection = constants.EFFORTSECTION;
        anEvent = new utils.DataEvent(constants.LOADEVENT);
        anEvent.effort = {};
        aSystemEvent = new utils.SystemEvent(constants.PENDINGEVENT, '');
        return dataStore.insertData(processingInstructions.dbUrl, constants.EVENTCOLLECTION, [anEvent])
        .then(document => {
          insertedDocument = document.ops[0];
        });
      });

      it('fails the event if updateProjectStatus fails', () => {
        return CO(function* () {
          sandbox.stub(projectStatus, 'updateProjectStatus').rejects();
          const successfulSystemEvent = R.merge(aSystemEvent, { status: constants.SUCCESSEVENT });
          yield event.processEventData()(successfulSystemEvent, processingInstructions, insertedDocument._id)
          const updatedEvent = yield dataStore.getDocumentByID(processingInstructions.dbUrl, constants.EVENTCOLLECTION, insertedDocument._id)
          Should(updatedEvent.status).equal(constants.FAILEDEVENT);
        });
      });

      it('passes the event if updateProjectStatus passes', () => {
        return CO(function* () {
          sandbox.stub(projectStatus, 'updateProjectStatus').resolves();
          const successfulSystemEvent = R.merge(aSystemEvent, { status: constants.SUCCESSEVENT });
          yield event.processEventData()(successfulSystemEvent, processingInstructions, insertedDocument._id)
          const updatedEvent = yield dataStore.getDocumentByID(processingInstructions.dbUrl, constants.EVENTCOLLECTION, insertedDocument._id)
          Should(updatedEvent.status).equal(constants.SUCCESSEVENT);
        });
      });
    });
  })

  afterEach(() => {
    sandbox.restore();
    return CO(function* () {
      yield dataStore.clearData(utils.dbProjectPath(testConstants.UNITTESTPROJECT), constants.EVENTCOLLECTION);
    });
  });
});



