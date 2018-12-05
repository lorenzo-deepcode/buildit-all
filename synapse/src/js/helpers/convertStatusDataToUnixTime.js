const moment = require('moment');

module.exports = (data) => data.map(datapoint => [moment(datapoint.date).unix(), datapoint.value]);
