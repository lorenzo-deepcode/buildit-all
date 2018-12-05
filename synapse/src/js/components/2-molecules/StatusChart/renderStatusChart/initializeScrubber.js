const removeElement = require('./removeElement');

module.exports = (containerElement, x) => {
  removeElement('scrubber');

  const scrubber = containerElement
    .append('g')
      .attr('id', 'scrubber');

  scrubber
    .append('line')
      .attr('x1', '0')
      .attr('x2', '0')
      .attr('y1', 0)
      .attr('y2', 2000);

  scrubber
    .append('text')
      .attr('class', 'scrubber-date')
      .attr('x', '0')
      .attr('y', '-15')
      .attr('text-anchor', 'middle')
      .text('');

  scrubber
    .attr('transform', `translate(${x}, 0)`);

  return scrubber;
};
