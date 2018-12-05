'use strict';

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const utils = require('../util/utils');

// ***************************************
//
//  initialize HERE
//
// ***************************************

var project = {};
var demandSequence = [];
var defectSeverity = [];
var roleNames = [];
var demandInfo = {};
var defectInfo = {};
var effortInfo = {};
var projectionInfo = {};

// ***************************************
// *********  Project structures
// ***************************************
demandInfo = {
  source: 'Jira',
  url: "https://digitalrig.atlassian.net/rest/api/latest/",
  project: 'CIT',
  authPolicy: 'Basic',
  userData: 'ZGlnaXRhbHJpZzpEMWchdGFsUmln',
  flow: [{name: 'Backlog'}, {name: 'In Progress'}, {name: 'UX Review'}, {name: 'Done'}]};

roleNames = [];
roleNames.push({name: "General / Delivery", groupWith: null});
roleNames.push({name: "Billable Support", groupWith: null});
roleNames.push({name: "Discovery", groupWith: null});
effortInfo = {
  source: "Harvest",
  url: "https://builditglobal.harvestapp.com/",
  project: "10284278",
  authPolicy: "Basic",
  userData: "cGF1bC5rYXJzdGVuQHdpcHJvLmNvbTpXaDFwSXRHMDBk",
  role: roleNames};

  project = {
    name: "TESTE2ELOAD",
    program: "Basic Test Data",
    portfolio: "Acceptance Test Data",
    description: "Configured to load actual data from Harvest for a known project to test ETL",
    startDate: "2016-07-01",
    endDate: "2016-12-01",
    demand: demandInfo,
    defect: defectInfo,
    effort: {},
    projection: projectionInfo};

MongoClient.connect(utils.dbCorePath(), function (err, db) {
  assert.equal(null, err);
  var col = db.collection('project');
  col.findOneAndReplace(
    {name: project.name},
    project,
    {upsert: true},
    function (error, doc) {
      assert.equal(null, error);
      assert.equal(1, doc.lastErrorObject.n);
      db.close();
    }
  );
});
