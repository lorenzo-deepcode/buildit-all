const sumValuesInObject = require('sum-values-in-object');

module.exports = (data, categories) => (
  data.map(datapoint => sumValuesInObject(datapoint, categories))
);
