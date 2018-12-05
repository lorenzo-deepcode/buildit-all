const d3 = require('d3');

module.exports = (containerElement, width, height, padding) => {
  const containerPadding = 100;
  const totalWidth = width + padding.left + padding.right + containerPadding;
  const totalHeight = height + padding.top + padding.bottom;
  const chart = d3.select(containerElement).append('svg')
    .attr('class', 'chart-container')
    .attr('width', totalWidth)
    .attr('height', totalHeight)
    .append('g')
      .attr('class', 'chart-inner-container')
      .attr('transform', `translate(${padding.left}, ${padding.top})`);

  // This transparent "background" gives the mouseover listener something to listen to.
  chart.append('rect')
    .attr('class', 'background')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', totalWidth)
    .attr('height', totalHeight);

  return chart;
};
