module.exports = (containerElement, date, xOffset, yOffset) => {
  const message = date ?
  `Forecasted completion date: ${date.format('MMM DD, YYYY')}` :
  'Completion date cannot be determined';

  return (
    containerElement
      .append('g')
      .attr('class', 'forecasted-completion-date')
      .attr('transform', `translate(0, ${yOffset - 15})`)
      .append('text')
      .attr('text-anchor', 'start')
      .text(message)
  );
};
