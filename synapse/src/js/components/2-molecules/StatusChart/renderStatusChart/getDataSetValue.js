// Given a date, status data, and a key (e.g. "Done")
// return the value for that datapoint

module.exports = (targetDate, data, key) => {
  let value;
  data.forEach(datapoint => {
    if (datapoint.date === targetDate) value = datapoint[key];
  });
  return value;
};
