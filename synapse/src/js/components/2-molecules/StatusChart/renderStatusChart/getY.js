// Given a date, status data, and a key (e.g. "Done")
// return the pixel value for that datapoint in the given key's set

module.exports = (targetDate, data, key, yScale) => {
  let y;
  data.forEach(datapoint => {
    if (datapoint.date === targetDate) y = datapoint[key];
  });
  return yScale(y);
};
