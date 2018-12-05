module.exports = (containerElement, label, xOffset, yOffset) => (
  containerElement
    .append('g')
    .attr('transform', `translate(${xOffset - 55}, ${yOffset + 140})`)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('class', 'y label')
      .attr('text-anchor', 'end')
      .text(label)
);
