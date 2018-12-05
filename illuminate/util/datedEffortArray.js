'use strict'

const R = require('ramda');
const utils = require('./utils');

class DatedEffortArray {

  constructor() {
    this.timeEntries = [];
  }

  asJSON() {
    return JSON.parse(JSON.stringify(this.timeEntries));
  }

  size() {
    return this.timeEntries.length
  }

  addTimeEntry(day, role, effort) {
    var anEntry = {};
    anEntry.day = utils.dateFormatIWant(day);
    anEntry.effort = effort;
    anEntry.role = role;

    this.timeEntries.push(anEntry);
  }

  addTimeArray(arrayOfEffort) {
    this.timeEntries = R.union(this.timeEntries, arrayOfEffort);
  }

  typeOf() {
    return 'DatedEffortArray';
  }
}

exports.DatedEffortArray = DatedEffortArray;
