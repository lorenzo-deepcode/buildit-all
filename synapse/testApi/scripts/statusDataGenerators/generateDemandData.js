const standard = require('../../dataSets/demand/standard');
const missingData = require('../../dataSets/demand/missingData');
const invalidDate = require('../../dataSets/demand/invalidDate');

module.exports = dataSet => {
  switch (dataSet) {
  case 'STANDARD': return standard;
  case 'MISSING DATA': return missingData;
  case 'INVALID DATE': return invalidDate;
  default: return [];
  }
};
