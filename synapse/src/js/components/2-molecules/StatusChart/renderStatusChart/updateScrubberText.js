const d3 = require('d3');
const moment = require('moment');

module.exports = date => {
  const formattedDate = moment(date).format('MMM DD YYYY');
  d3.select('.scrubber-date').text(formattedDate);
};
