const d3 = require('d3');

module.exports = (containerElement, data, categories, yScale, chartHeight) => {
  const stack = d3.stack()
    .keys(categories)
    .order(d3.stackOrderReverse)
    .offset(d3.stackOffsetNone);

  // Place the legend 30 px from the top of its chart
  const yTranslation = yScale(0) - chartHeight + 30;

  const legend = containerElement.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(0, ${yTranslation})`);

  legend.selectAll('.legend-item')
    .data(stack(data))
    .enter()
    .append('circle')
      .attr('r', 5)
      .attr('cx', 35)
      .attr('cy', (d, i) => i * 14)
      .attr('stroke', 'none')
      .attr('fill', (d, i) => d3.schemeCategory20[i]);

  legend.selectAll('.legend-item')
    .data(stack(data))
    .enter()
    .append('text')
      .attr('class', 'legend-item')
      .attr('x', 45)
      .attr('y', (d, i) => 4 + i * 14)
      .text(d => d.key);

  // TODO: Make this general to all values
  legend.selectAll('.legend-count')
    .data(stack(data))
    .enter()
    .append('text')
    .attr('class', 'legend-count')
    .attr('text-anchor', 'end')
    .attr('class', d => {
      /* eslint-disable no-underscore-dangle */
      const datasetId = containerElement._groups[0][0].id;
      /* eslint-enable no-underscore-dangle */
      const categoryIdentifier = d.key.split(' ').join('-');
      return `${datasetId}-${categoryIdentifier}`;
    })
    .attr('x', 25)
    .attr('y', (d, i) => 4 + i * 14)
    .text('');
};
