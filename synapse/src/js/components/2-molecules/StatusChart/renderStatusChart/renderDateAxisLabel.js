module.exports = (containerElement, label, width, chartHeight) => (
  containerElement
    .append('g')
    .attr('transform', `translate(${width / 2}, ${chartHeight + 60})`)
      .append('text')
      .attr('class', 'date label')
      .attr('x', '5')
      .attr('y', '5')
      .text(label)
);
