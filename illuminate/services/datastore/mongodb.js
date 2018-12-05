'use strict'

const CO = require('co');
const Config = require('config');
const Log4js = require('log4js');
const MongoClient = require('mongodb');
const R = require('ramda');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

var connectionPool = [];

function getDBConnection(path) {
  return CO(function* () {
    if (R.isNil(connectionPool[path])) {
      const db = yield MongoClient.connect(path);
      setDBConnection(path, db);
    }
    return connectionPool[path];
  });
}

function setDBConnection(path, db) {
  return connectionPool[path] = db;
}

/* eslint-disable no-unused-vars */
exports.deepPing = function () {
  logger.debug('pingDeep - mongodb');

  var dbUrl = Config.get('datastore.dbUrl');

  return new Promise(function (resolve, reject) {
    MongoClient.connect(dbUrl, function(err, db) {
      if (err) {
        logger.error(`Error connecting to Mongo ${dbUrl}`);
        resolve(generateConnectionInformation(dbUrl, 'Unable to access the data store'));
      } else {
        var adminDb = db.admin();
        adminDb.buildInfo(function(err, info) {
          if (err) {
            logger.error(`Error connecting to Mongo ${dbUrl}`);
            resolve(generateConnectionInformation(dbUrl, 'Unable to access admin data store'));
          } else {
            resolve(generateConnectionInformation(dbUrl, info.version));
          }
        });
      }
    });
  });
}
/* eslint-enable no-unused-vars */

function generateConnectionInformation(url, version) {
  logger.debug(`DataStoreURL : ${url} - DataStoreVersion: ${version}`);
  return {DataStoreURL: url, DataStoreVersion: version};
}

exports.upsertData = function (projectPath, collectionName, documentToStore) {
  logger.debug(`UPSERT ${documentToStore.length} documents in [${collectionName}] at URL ${projectPath}`);

  return CO(function*() {
    var db = yield getDBConnection(projectPath);
    var col = db.collection(collectionName);

    const upserts = documentToStore.map(anEntry => ({
      replaceOne: {
        filter: { _id: anEntry._id },
        replacement: anEntry,
        upsert: true,
      }
    }));

    yield col.bulkWrite(upserts);
    
    const result = yield col.find().toArray();
    return result;
  }).catch((err) => {
    logger.error('upsertData', err);
    throw err;
  });
}

exports.insertData = function (projectPath, collectionName, documentToStore) {
  logger.debug(`INSERT ${documentToStore.length} documents in [${collectionName}] at URL [${projectPath}]`);

  return CO(function*() {
    var db = yield getDBConnection(projectPath);
    var col = db.collection(collectionName);
    var response = col.insertMany(documentToStore);
    return response;
  })
  .catch(error => {
    logger.error('insertData', error);
    throw error;
  });
}

exports.updateDocumentPart = function (projectPath, collectionName, _id, key, value) {
  logger.debug(`UPDATE PART OF DOCUMENT with _id [${_id}] in [${collectionName}] at URL [${projectPath}]`);

  return CO(function* () {
    const options = { returnOriginal: false };
    const setModifier = { $set: {} };
    setModifier.$set[key] = value;
    const db = yield getDBConnection(projectPath);
    const col = db.collection(collectionName);

    const result = yield col.findOneAndUpdate({ _id }, setModifier, options);
    if (result.lastErrorObject.updatedExisting) {
      return result.value
    } 
    throw new Error(`No document found with id [${_id}]`);
  })
  .catch(error => {
    logger.error('updateDocumentPart', error);
    throw error;
  });
}

exports.getAllData = function (projectPath, collectionName) {
  logger.debug(`GET ALL [${collectionName}] Entries at URL ${projectPath}`);

  return CO(function*() {
    var db = yield getDBConnection(projectPath);
    var col = db.collection(collectionName);
    var result = yield col.find().toArray();
    return result;
  }).catch(err => {
    logger.error('getAllData', err);
    throw err;
  });
}

exports.getDocumentByName = function (projectPath, collectionName, aName) {
  logger.debug(`GET By Name [${aName}] from [${collectionName}] at URL ${projectPath}`);

  return CO(function*() {
    var db = yield getDBConnection(projectPath);
    var col = db.collection(collectionName);
    var result = yield col.find({name: aName}).toArray();
    return result[0];
  }).catch(err => {
    logger.error('getDocumentByName', err);
    throw err;
  });
}

exports.getDocumentByID = function (projectPath, collectionName, anID) {
  logger.debug(`GET By ID [${anID}] from [${collectionName}] at URL ${projectPath}`);

  return CO(function*() {
    var db = yield getDBConnection(projectPath);
    var col = db.collection(collectionName);
    var result = yield col.find({_id: anID}).toArray();
    return result[0];
  }).catch(err => {
    logger.error('getDocumentByID', err);
    throw err;
  });
}

exports.clearData = function (projectPath, collectionName) {
  logger.debug(`DELETE [${collectionName}] Entries at URL ${projectPath}`);

  return CO(function*() {
    var db = yield getDBConnection(projectPath);
    var col = db.collection(collectionName);
    var result = yield col.deleteMany();
    return result;
  }).catch(err => {
    logger.error('clearData', err);
    throw err;
  });
}

exports.wipeAndStoreData = function (projectPath, aCollection, documentToStore) {
  logger.debug(`WIPE and STORE ${documentToStore.length} documents in [${aCollection}] at URL ${projectPath}`);

  return module.exports.clearData(projectPath, aCollection)
  .then(() => module.exports.insertData(projectPath, aCollection, documentToStore))
  .catch(err => {
    logger.error('wipeAndStoreData', err);
    throw err;
  });
}

