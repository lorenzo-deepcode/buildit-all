const constants = require('../util/constants');
const utils = require('../util/utils');
const dataStore = require('../services/datastore/mongodb');
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

const SAMPLEPROJECTDATA = {
  name: 'COLLECTION-FOR-UNITESTING', // warning - I can't figure out how to use runtime constants for defineing other constants - change at your own risk
  program: "Projection Test Data",
  portfolio: "Unit Test Data",
  description: "A set of basic test data to be used to validate behavior of client systems.",
  startDate: null,
  endDate: null,
  demand: {},
  defect: {},
  effort: {
    source: 'GOODSOURCE',
    url: 'https://builditglobal.harvestapp.com',
    project: 'GOODPROJECT',
    authPolicy: 'Basic',
    userData: 'cGF1bC5rYXJzdGVuQHdpcHJvLmNvbTpXaDFwSXRHMDBk',
    role: []
  },
  projection: {}
};

describe('updateProjectStatus', () => {
    const sandbox = Sinon.sandbox.create();
    function makeStatuses() {
      return {
        demand: [{ status: constants.STATUSOK }, { status: constants.STATUSOK }],
        defect: [{ status: constants.STATUSOK }, { status: constants.STATUSOK }],
        effort: [{ status: constants.STATUSOK }, { status: constants.STATUSOK }],
      }
    }

    function getProjectStatus() {
      return dataStore.getDocumentByName(utils.dbCorePath(), constants.PROJECTCOLLECTION, SAMPLEPROJECTDATA.name)
      .then(project => {
        return project.status;
      });
    }

    beforeEach(() => {
      return CO(function* () {
        yield dataStore.insertData(utils.dbCorePath(), constants.PROJECTCOLLECTION, [SAMPLEPROJECTDATA]);
      });
    });
    
    it('does nothing if no statuses returned', () => {
      return CO(function* () {
        const statuses = {};
        sandbox.stub(statusIndicators, 'getStatuses').resolves(statuses);
        yield projectStatus.updateProjectStatus(SAMPLEPROJECTDATA, utils.dbProjectPath(SAMPLEPROJECTDATA.name));
        const status = yield getProjectStatus();
        Should(status).be.undefined();
      });
    });

    it('marks the status as OK if all of the statuses are green', () => {
      return CO(function* () {
        const statuses = makeStatuses();
        sandbox.stub(statusIndicators, 'getStatuses').resolves(statuses);
        yield projectStatus.updateProjectStatus(SAMPLEPROJECTDATA, utils.dbProjectPath(SAMPLEPROJECTDATA.name));
        const status = yield getProjectStatus();
        Should(status).equal(constants.STATUSOK);
      });
    });

    it('marks the status as WARN if any demand statuses are WARN', () => {
      return CO(function* () {
        const statuses = makeStatuses();
        statuses.demand[0].status = constants.STATUSWARNING;
        sandbox.stub(statusIndicators, 'getStatuses').resolves(statuses);
        yield projectStatus.updateProjectStatus(SAMPLEPROJECTDATA, utils.dbProjectPath(SAMPLEPROJECTDATA.name));
        const status = yield getProjectStatus();
        Should(status).equal(constants.STATUSWARNING);
      });
    });

    it('marks the status as WARN if any defect statuses are WARN', () => {
      return CO(function* () {
        const statuses = makeStatuses();
        statuses.defect[0].status = constants.STATUSWARNING;
        sandbox.stub(statusIndicators, 'getStatuses').resolves(statuses);
        yield projectStatus.updateProjectStatus(SAMPLEPROJECTDATA, utils.dbProjectPath(SAMPLEPROJECTDATA.name));
        const status = yield getProjectStatus();
        Should(status).equal(constants.STATUSWARNING);
      });
    });

    it('marks the status as WARN if any effort statuses are WARN', () => {
      return CO(function* () {
        const statuses = makeStatuses();
        statuses.effort[0].status = constants.STATUSWARNING;
        sandbox.stub(statusIndicators, 'getStatuses').resolves(statuses);
        yield projectStatus.updateProjectStatus(SAMPLEPROJECTDATA, utils.dbProjectPath(SAMPLEPROJECTDATA.name));
        const status = yield getProjectStatus();
        Should(status).equal(constants.STATUSWARNING);
      });
    });

    it('marks the status as ERROR if any demand statuses are ERROR', () => {
      return CO(function* () {
        const statuses = makeStatuses();
        statuses.effort[0].status = constants.STATUSERROR;
        sandbox.stub(statusIndicators, 'getStatuses').resolves(statuses);
        yield projectStatus.updateProjectStatus(SAMPLEPROJECTDATA, utils.dbProjectPath(SAMPLEPROJECTDATA.name));
        const status = yield getProjectStatus();
        Should(status).equal(constants.STATUSERROR);
      });
    });

    it('marks the status as ERROR if any defect statuses are ERROR', () => {
      return CO(function* () {
        const statuses = makeStatuses();
        statuses.effort[0].status = constants.STATUSERROR;
        sandbox.stub(statusIndicators, 'getStatuses').resolves(statuses);
        yield projectStatus.updateProjectStatus(SAMPLEPROJECTDATA, utils.dbProjectPath(SAMPLEPROJECTDATA.name));
        const status = yield getProjectStatus();
        Should(status).equal(constants.STATUSERROR);
      });
    });

    it('marks the status as ERROR if any demand the statuses are ERROR', () => {
      return CO(function* () {
        const statuses = makeStatuses();
        statuses.effort[0].status = constants.STATUSERROR;
        sandbox.stub(statusIndicators, 'getStatuses').resolves(statuses);
        yield projectStatus.updateProjectStatus(SAMPLEPROJECTDATA, utils.dbProjectPath(SAMPLEPROJECTDATA.name));
        const status = yield getProjectStatus();
        Should(status).equal(constants.STATUSERROR);
      });
    });

    it('ERROR statuses take precedence over WARN statuses', () => {
      return CO(function* () {
        const statuses = makeStatuses();
        statuses.demand[0].status = constants.STATUSERROR;
        statuses.defect[0].status = constants.STATUSWARN;
        sandbox.stub(statusIndicators, 'getStatuses').resolves(statuses);
        yield projectStatus.updateProjectStatus(SAMPLEPROJECTDATA, utils.dbProjectPath(SAMPLEPROJECTDATA.name));
        const status = yield getProjectStatus();
        Should(status).equal(constants.STATUSERROR);
      });
    });

    it('stores the statuses in the correct collection', () => {
      return CO(function* () {
        const statuses = makeStatuses();
        sandbox.stub(statusIndicators, 'getStatuses').resolves(statuses);
        yield projectStatus.updateProjectStatus(SAMPLEPROJECTDATA, utils.dbProjectPath(SAMPLEPROJECTDATA.name));
        const status = yield dataStore.getAllData(utils.dbProjectPath(SAMPLEPROJECTDATA.name), constants.STATUSCOLLECTION)
        Should(status).match(R.flatten(makeStatuses()));
      });
    });

    afterEach(() => {
      return CO(function* () {
        yield dataStore.clearData(utils.dbCorePath(), constants.PROJECTCOLLECTION);
        sandbox.restore();
      });
    })
  });