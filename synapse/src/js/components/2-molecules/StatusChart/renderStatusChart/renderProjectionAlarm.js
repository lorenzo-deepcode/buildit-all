module.exports = (containerElement, xOffset, yOffset) => (
  containerElement
  .append('g')
  .attr('class', 'projection-alarm')
  .attr('transform', `translate(0, ${yOffset - 30})`)
    .append('text')
    .attr('text-anchor', 'start')
    .text('Projected end-date is exceeded!')
);
