'use strict'

const CO = require('co');
const Config = require('config');
const errorHelper = require('../errors');
const HttpStatus = require('http-status-codes');
const Log4js = require('log4js');
const MongoClient = require('mongodb');
const utils = require('../../util/utils');

Log4js.configure('config/log4js_config.json', {});
const logger = Log4js.getLogger();
logger.level = Config.get('log-level');

exports.getDemandByName = function (req, res) {
  var projectName = decodeURIComponent(req.params.name);
  logger.info(`getDemandByName for ${projectName}`);

  CO(function*() {
    var db = yield MongoClient.connect(utils.dbCorePath());
    var col = db.collection('project');
    var aDemandSystem = yield col.find({name: projectName}, {_id: 0, demand: 1}).toArray();
    db.close();

    if (aDemandSystem.length < 1) {
      logger.debug("getDemandByName -> Not Found");
      res.status(HttpStatus.NOT_FOUND);
      res.send(errorHelper.errorBody(HttpStatus.NOT_FOUND, `Unable to find a demand system defined for project ${projectName}`));
    } else {
      res.send(aDemandSystem[0]);
    }
  }).catch(function(err) {
    logger.debug("getDemandByName -> ERROR");
    logger.error(err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(errorHelper.errorBody(HttpStatus.INTERNAL_SERVER_ERROR, `Unable to find project ${projectName}`));
  });
};
