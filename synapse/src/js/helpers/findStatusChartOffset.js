// Given an array of status datasets (i.e. demand, defect, and effort data)
// and the spacing in pixels between each chart
// return an array of integers that represent the pixel offsets for each of
// the datasets' charts.

module.exports = (datasets, spacing) => {
  let chartCount = 0;
  const result = [];
  datasets.forEach(dataset => {
    if (dataset.length > 0) {
      result.push(chartCount * spacing);
      chartCount++;
    } else {
      result.push(0);
    }
  });
  return result;
};
