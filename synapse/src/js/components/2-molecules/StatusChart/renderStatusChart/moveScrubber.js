module.exports = (scrubberElement, x) => {
  scrubberElement
    .style('visibility', 'visible')
    .style('opacity', '0.7')
    .attr('transform', `translate(${x}, 0)`);
};
