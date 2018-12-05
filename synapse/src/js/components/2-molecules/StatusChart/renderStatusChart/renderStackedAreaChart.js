const d3 = require('d3');
const removeElement = require('./removeElement');
import parseTime from './parseTime';

module.exports = (
  containerElement,
  data,
  categories,
  yScale,
  dateScale,
  chartPaddingLeft,
  chartID
) => {
  removeElement(chartID);

  const area = d3.area()
    .x(d => dateScale(parseTime(d.data.date)))
    .y0(d => yScale(d[0] || 0))
    .y1(d => yScale(d[1] || 0));

  const stack = d3.stack()
    .keys(categories)
    .order(d3.stackOrderReverse)
    .offset(d3.stackOffsetNone);

  const stackContainer = containerElement.append('g')
    .attr('id', chartID);

  if (data.length > 0) {
    stackContainer
      .attr('class', 'stack');

    const layer = stackContainer.selectAll('.layer')
      .data(stack(data))
      .enter()
      .append('g')
      .attr('class', 'layer')
      .attr('transform', `translate(${chartPaddingLeft}, 0)`);

    layer.append('path')
      .attr('class', 'area')
      .style('stroke-width', '2px')
      .style('fill', (d, i) => {
        if (chartID === 'effortChart') {
          return 'none';
        }
        return d3.schemeCategory20[i];
      })
      .style('stroke', (d, i) => {
        if (chartID === 'effortChart') {
          return d3.schemeCategory20[i];
        }
        return 'none';
      })
      .attr('d', area);
  }

  return stackContainer;
};
