'use strict'

var fs = require("fs");
var Moment = require('moment');
var illuminateSystems = require('@buildit/illuminate-systems');
var jira = illuminateSystems.demand.jira;

var DEFAULTSTARTDATE = '2000-01-01';
var DBDATEFORMAT = 'YYYY-MM-DD';

///
/// EXAMPLE
///
///  index.js user pass NETWRKDIAG 'https://digitalrig.atlassian.net/rest/api/latest/'
///

function errorBody(code, description) {
  var errorBody = {error: { statusCode: code, message: description}};
  return (errorBody);
}

exports.writeThisData = function (fileName, ignoreThis, dataToStore) {
  return new Promise(function(resolve, reject) {
      var fullFile = './'+fileName+'.json';
      fs.writeFile(fullFile, JSON.stringify(dataToStore), function(err) {
          if (err) {
            console.log(`file write error ${err}`);
            reject(err);
          }
          else {
            console.log(`File ${fullFile} has been created`);
            resolve(dataToStore);
          }
      });
  });
}

function processingInfo(repoName, functionName) {
  return ({name: repoName, dbUrl: repoName, storageFunction: functionName});
}

function sectionInfo(repoName, path, user, pass) {
  return ({source: "Jira", url: path, project: repoName, authPolicy: "Basic", userData: new Buffer(user + ':' + pass).toString('base64')});
}

///
///  As of this writing the JIRA REST API does not provide a way to determine
///  which workflow is associated with a particular project.
///  SO - loop through all of the data you got back and determine the unquie statusCode values
///  And then write them out so they can be entered into Synapse for processing.
///
///  there has to be a better algorithm, but for now brute force this
///
function determineUniqueStatusCodes(data) {

  var statusValues = [];

  data.forEach(function (aStory) {

    aStory.changelog.histories.forEach(function (history) {
      if (history.items.field === 'status' || history.items.field === 'resolution') {

        // if this is a resolution status change where the item was moved from the resolved state
        // there is no indication of the new state.  So this just assumes the issue is in the most
        // recent previous state.  One hopes that there is never a case where an issue is created
        // in a resolved state, but I think the code will work anyway.
        if ((history.items.toString != null) && history.items.toString != undefined ) {
          if (statusValues.indexOf(history.items.toString) < 0) {
            statusValues.push(history.items.toString);
          }
        }
      }
    });

    if (statusValues.indexOf(aStory.fields.status.name) < 0) {
      statusValues.push(aStory.fields.status.name);
    }
  });

  console.log('*** Project Status Values - SAVE THESE');
  console.log(JSON.stringify(statusValues));
}

var myArgs = process.argv.slice(2);

console.log(`args length ${myArgs.length}`);
console.log(`args 0 ${myArgs[0]}`);
console.log(`args 1 ${myArgs[1]}`);
console.log(`args 2 ${myArgs[2]}`);
console.log(`args 3 ${myArgs[3]}`);

if (myArgs.length < 4) {
  console.log("commmand line args required");
  exit(0);
}

jira.loadRawData(sectionInfo(myArgs[2], myArgs[3], myArgs[0], myArgs[1]),
   processingInfo(myArgs[2], exports.writeThisData),
   Moment.utc(DEFAULTSTARTDATE).format(DBDATEFORMAT),
   errorBody).then( function(data) {
     determineUniqueStatusCodes(data);
     console.log('DONE');
   }).catch(function(err) {
     console.log(`ERROR : ${JSON.stringify(err)}`)
   });
