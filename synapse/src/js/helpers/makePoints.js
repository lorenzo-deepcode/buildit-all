const moment = require('moment');

const makePoints = (projection, startDate) => {
  const {
    backlogSize,
    darkMatter,
    periodStart,
    periodEnd,
    velocityStart,
    velocityMiddle,
    velocityEnd,
    iterationLength,
  } = projection;

  const backlogSizeWithDarkMatter = backlogSize + backlogSize * (darkMatter / 100);

  const periodMiddle =
  (backlogSizeWithDarkMatter - (velocityStart * periodStart) - (velocityEnd * periodEnd))
    / velocityMiddle;

  const p0 = {
    x: 0,
    y: 0,
    date: startDate,
  };

  const p1 = {
    x: periodStart,
    y: velocityStart * periodStart,
  };
  const iterationsToSecondPoint = p1.x;
  let parsedStartDate = moment(startDate, 'DD-MMM-YY');
  p1.date =
    parsedStartDate.add(iterationsToSecondPoint * iterationLength, 'weeks').format('DD-MMM-YY');

  const p2 = {
    x: periodStart + periodMiddle,
    y: p1.y + velocityMiddle * periodMiddle,
  };
  const iterationsToThirdPoint = p2.x;
  parsedStartDate = moment(startDate, 'DD-MMM-YY');
  p2.date =
    parsedStartDate.add(iterationsToThirdPoint * iterationLength, 'weeks').format('DD-MMM-YY');

  const p3 = {
    x: periodStart + periodMiddle + periodEnd,
    y: p2.y + velocityEnd * periodEnd,
  };
  const iterationsToFourthPoint = p3.x;
  parsedStartDate = moment(startDate, 'DD-MMM-YY');
  p3.date =
    parsedStartDate.add(iterationsToFourthPoint * iterationLength, 'weeks').format('DD-MMM-YY');

  return [
    p0,
    p1,
    p2,
    p3,
  ];
};

module.exports = makePoints;
