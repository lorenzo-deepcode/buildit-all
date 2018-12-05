'use strict'

const constants = require('../util/constants');
const mongoDB = require('../services/datastore/mongodb');
const Should = require('should');
const testConstants = require('./testConstants');
const utils = require('../util/utils');

const Config = require('config');
const Log4js = require('log4js');
const R = require('ramda');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

const VALIDID = 'f9d6e2df-ca15-4ebb-ac1d-1a6bf1129af9';
const INVALIDID = 99999999;
const VALIDNAME = "UncleBob";
const INVALIDNAME = "UncleRobert";

const GETTESTDATA = [
  {
    _id: VALIDID,
    name: VALIDNAME,
    otherStuff: "2015-10-21"
  }
];

const EFFORTDATAFIRST = [
  {
    _id: 439722386,
    day_entry:
    {
      id: 439722386,
      name: "UncleBob",
      spent_at: "2015-10-21",
      hours: 8
    }
  },
  {
    _id: 439722390,
    day_entry:
    {
      id: 439722390,
      spent_at: "2015-10-22",
      hours: 8
    }
  }
];

const EFFORTDATASECOND = [
  {
    _id: 439722386,
    day_entry:
    {
      id: 439722386,
      spent_at: "2015-10-21",
      hours: 4
    }
  },
  {
    _id: 12345678,
    day_entry:
    {
      id: 12345678,
      spent_at: "2015-10-23",
      hours: 8
    }
  }
];

const EXPECTEDAFTERUPDATE = [
  {
    _id: 439722386,
    day_entry:
    {
      id: 439722386,
      spent_at: "2015-10-21",
      hours: 4
    }
  },
  {
    _id: 439722390,
    day_entry:
    {
      id: 439722390,
      spent_at: "2015-10-22",
      hours: 8
    }
  },
  {
    _id: 12345678,
    day_entry:
    {
      id: 12345678,
      spent_at: "2015-10-23",
      hours: 8
    }
  }
];

describe('mongo', () => {

  describe('Test of insert on existing document', () => {
    var url = '';

    before('setup', () => {
        url = utils.dbProjectPath(testConstants.UNITTESTPROJECT);
    });

    it('Insert 2 things', () =>
      mongoDB.insertData(url, constants.RAWEFFORT, EFFORTDATAFIRST)
      .then(() => mongoDB.insertData(url, constants.RAWEFFORT, EFFORTDATAFIRST))
      .then(() => Should.fail())
      .catch(() => Should.ok(true))
    );

    after('Delete the stuff you created', () => mongoDB.clearData(url, constants.RAWEFFORT));
  })

  describe('Test of Insert and Update function. (well and the getall and clear too)', () => {
    var url = '';

    before('setup', () => {
        url = utils.dbProjectPath(testConstants.UNITTESTPROJECT);
    });

    it('Insert 2 things', () => {
      return mongoDB.insertData(url, constants.RAWEFFORT, EFFORTDATAFIRST)
      .then (() => mongoDB.getAllData(url, constants.RAWEFFORT))
      .then ((readData) => {
        readData.sort((a, b) => a._id < b._id ? -1 : 1);
        Should(EFFORTDATAFIRST).deepEqual(readData)
      });
    });

    it('Now provide data that updates 1, inserts another, and does not contain the third', function() {
      return mongoDB.upsertData(url, constants.RAWEFFORT, EFFORTDATASECOND)
      .then (() => mongoDB.getAllData(url, constants.RAWEFFORT))
      .then ((readData) => Should(EXPECTEDAFTERUPDATE).deepEqual(readData));
    });

    after('Delete the stuff you created', function() {
      return mongoDB.clearData(url, constants.RAWEFFORT);
    });
  });

  describe('Test that an upsert inserts', () => {
    let url = '';
    before('setup', () => {
      url = utils.dbProjectPath(testConstants.UNITTESTPROJECT);
    });

    it('Insert 2 things', () =>
      mongoDB.upsertData(url, constants.RAWEFFORT, EFFORTDATAFIRST)
      .then (() => mongoDB.getAllData(url, constants.RAWEFFORT))
      .then ((readData) => {
        readData.sort((a, b) => a._id < b._id ? -1 : 1);
        Should(EFFORTDATAFIRST).deepEqual(readData)
      })
    );

    after('Delete the stuff you created', function() {
      return mongoDB.clearData(url, constants.RAWEFFORT);
    });
  });

  describe('Update part of a document', () => {
    var url = '';
    let event;
    let insertedDocument;

    before('setup', function () {
      url = utils.dbProjectPath(testConstants.UNITTESTPROJECT);

      event = new utils.DataEvent(constants.LOADEVENT);
      return mongoDB.insertData(url, constants.EVENTCOLLECTION, [event])
      .then(document => {
        insertedDocument = document.ops[0];
      });
    });

    it('should update the demand secion', () => {
      const demand = new utils.DemandHistoryEntry(constants.SUCCESSEVENT, '2017-08-11');
      const expected = R.merge(event, { demand });
      return mongoDB.updateDocumentPart(url, constants.EVENTCOLLECTION, insertedDocument._id, constants.DEMANDSECTION, demand)
      .then((updatedDocument) => Should(expected).match(updatedDocument));
    });

    it('should update the demand secion', () => {
      const demand = new utils.DemandHistoryEntry(constants.FAILUREEVENT, '2017-08-11');
      return mongoDB.updateDocumentPart(url, constants.EVENTCOLLECTION, 'document does not exist', constants.DEMANDSECTION, demand)
      .then(() => Should.ok(false))
      .catch(() => Should.ok(true));
    });

    after('Delete the stuff you created', function() {
      return mongoDB.clearData(url, constants.EVENTCOLLECTION);
    });

  });

  describe('Test of Wipe and Insert', function() {
    var url = '';

    before('setup', function () {
        url = utils.dbProjectPath(testConstants.UNITTESTPROJECT);
    });

    it('Insert 2 things', function() {
      return mongoDB.insertData(url, constants.RAWEFFORT, EFFORTDATAFIRST)
      .then ( function() {
        return mongoDB.getAllData(url, constants.RAWEFFORT)
        .then ( function(readData) {
          Should(EFFORTDATAFIRST).deepEqual(readData);
        })
      }).catch ( function() {
        Should.ok(false);
      });
    });

    it('Now provide differnt data, should wipe the first data out', function() {
      return mongoDB.wipeAndStoreData(url, constants.RAWEFFORT, EFFORTDATASECOND)
      .then ( function() {
        return mongoDB.getAllData(url, constants.RAWEFFORT)
        .then ( function(readData) {
          Should(EFFORTDATASECOND).deepEqual(readData);
        })
      }).catch ( function() {
        Should.ok(false);
      });
    });

    after('Delete the stuff you created', function() {
      return mongoDB.clearData(url, constants.RAWEFFORT);
    });
  });

  describe('Test of Get by ID and by Name', function() {
    var url = '';

    before('setup', function () {
        url = utils.dbProjectPath(testConstants.UNITTESTPROJECT);
    });

    it('Insert a thing', function() {
      return mongoDB.insertData(url, constants.RAWEFFORT, GETTESTDATA)
      .then ( function() {
        return mongoDB.getAllData(url, constants.RAWEFFORT)
        .then ( function(readData) {
          Should(GETTESTDATA).deepEqual(readData);
        })
      }).catch ( function() {
        Should.ok(false);
      });
    });

    it('Get by name', function() {
      return mongoDB.getDocumentByName(url, constants.RAWEFFORT, VALIDNAME)
        .then ( function(readData) {
          Should(GETTESTDATA[0]).deepEqual(readData);
        }).catch ( function() {
          Should.ok(false);
        });
    });

    it('Get by name - Not Found', function() {
      return mongoDB.getDocumentByName(url, constants.RAWEFFORT, INVALIDNAME)
        .then ( function() {
          Should.ok(false);
        }).catch ( function() {
          Should.ok(true);
        });
    });

    it('Get by _ID', function() {
      return mongoDB.getDocumentByID(url, constants.RAWEFFORT, VALIDID)
        .then ( function(readData) {
          Should(GETTESTDATA[0]).deepEqual(readData);
        }).catch ( function() {
          Should.ok(false);
        });
    });

    it('Get by _ID - Not Found', function() {
      return mongoDB.getDocumentByID(url, constants.RAWEFFORT, INVALIDID)
      .then ( function() {
        Should.ok(false);
      }).catch ( function() {
        Should.ok(true);
      });
    });

    after('Delete the stuff you created', function() {
      return mongoDB.clearData(url, constants.RAWEFFORT);
    });

  });
})

