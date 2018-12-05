const standard = require('../../dataSets/effort/standard');

module.exports = dataSet => {
  switch (dataSet) {
  case 'STANDARD': return standard;
  default: return [];
  }
};
