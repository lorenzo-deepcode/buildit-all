const standard = require('../../dataSets/defect/standard');

module.exports = dataSet => {
  switch (dataSet) {
  case 'STANDARD': return standard;
  default: return [];
  }
};
