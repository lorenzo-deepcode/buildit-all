module.exports = (containerElement, x, y, className) => (
  containerElement
    .append('circle')
    .attr('class', className)
    .attr('cx', x)
    .attr('cy', y)
);
