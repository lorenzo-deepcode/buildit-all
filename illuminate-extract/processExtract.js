const fs = require('fs');
const Moment = require('moment');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const R = require('ramda');

const MONGO_PATH = 'mongodb://localhost:27017/';
const DB_CONTEXT = 'ETL';
const ROOT_DB = 'buildit';
const JIRA_ISSUE_TYPE = 'Story';

const myArgs = process.argv.slice(2);

console.log(`args length ${myArgs.length}`);
console.log(`args 0 ${myArgs[0]}`);


const content = fs.readFileSync(myArgs[0]);

//Find First Date in list
const issues = JSON.parse(content)
console.log(`Total issues: ${issues.length}`)

//Lets just get the stories now
const stories = issues.filter((issue) => {
  return issue.fields.issuetype.name === JIRA_ISSUE_TYPE;
})
console.log(`Story Tickets: ${stories.length}`)

//Min created
stories.sort(function(a, b) {
    return Moment.utc(a.fields.created) - Moment.utc(b.fields.created);
});
console.log(`First Created: ${stories[0].fields.created}`)
const startDate = Moment.utc(stories[0].fields.created).format();

//Max resolution
stories.sort(function(a, b) {
    return Moment.utc(b.fields.updated) - Moment.utc(a.fields.updated) ;
});
console.log(`Last Resolution: ${stories[0].fields.updated}`)
const endDate = Moment.utc(stories[0].fields.updated).format();

// fix history && get status values
statusNames = []
stories.forEach(function (aStory) {
    aStory['_id'] = aStory.id;
    aStory.changelog.histories.forEach(function (history) {
      history.items = R.clone(history.items[0]);
      if (history.items.field == "status") {
        statusNames.push(history.items.toString);
      }
    });
  });


//Unique Status
const statusValues = [...new Set(statusNames)]
console.log(statusValues)

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
  var defectInfo = null;
  var effortInfo = null;
  var projectionInfo = null;

  // ***************************************
  // *********  Project structures
  // ***************************************

  demandSequence = [];
  statusValues.forEach(function (aStatusValue) {
    demandSequence.push({name: aStatusValue, groupWith: null});
  });
  demandInfo = {
    source: 'JIRA',
    url: stories[0].fields.project.self,
    project: stories[0].fields.project.key,
    authPolicy: 'None',
    userData: '',
    flow: demandSequence};

    project = {
      name: stories[0].fields.project.key,
      program: 'Program',
      portfolio: 'Portfolio',
      description: stories[0].fields.project.name,
      startDate: startDate,
      endDate: endDate,
      demand: demandInfo,
      defect: defectInfo,
      effort: effortInfo,
      projection: projectionInfo,
      status: 'green',
    };

  MongoClient.connect(`${MONGO_PATH}${DB_CONTEXT}-${ROOT_DB}`, function (err, db) {
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


   MongoClient.connect(`${MONGO_PATH}${DB_CONTEXT}-${stories[0].fields.project.key}`}, function (err, db) {
     assert.equal(null, err);
     var col = db.collection('rawDemand');
     col.deleteMany({}).then(function () {
        col.insertMany(stories).then(function (r) {
          assert.equal(stories.length, r.insertedCount);
       });
    db.close();
  }
);
});
