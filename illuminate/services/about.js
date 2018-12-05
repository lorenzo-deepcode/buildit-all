'use strict'

const Config = require('config');
const Log4js = require('log4js');
const HttpStatus = require('http-status-codes');
const dataStore = require('./datastore/mongodb');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

exports.ping = function(req, res) {
  logger.info('ping');
  res.status(HttpStatus.OK);
  res.json(Config);
};

exports.deepPing = function (req, res) {
  logger.info('pingDeep');

 var externalInfo = {};

  dataStore.deepPing()
    .then(function (databaseResult){
      externalInfo["DataStore"] = databaseResult;
      res.status(HttpStatus.OK);
      res.json(externalInfo);
    })
    .catch(function (reason) {
      logger.debug(`Problem processing Datastore connection for Deep Ping ${reason}`);
      res.status(HttpStatus.OK);
      res.send(externalInfo);
    });
};
