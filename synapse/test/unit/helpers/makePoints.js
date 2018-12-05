import makePoints from 'helpers/makePoints';
const assert = require('chai').assert;

describe('Projection chart points maker', () => {
  const projection1 = {
    backlogSize: 100,
    darkMatter: 0,
    iterationLength: 0,

    periodStart: 2,
    periodEnd: 2,

    velocityStart: 4,
    velocityMiddle: 8,
    velocityEnd: 4,
  };

  const points1 = makePoints(projection1);

  it('is a function', () => {
    assert.equal(typeof makePoints, 'function');
  });

  it('makes four points', () => {
    assert.equal(points1.length, 4);
  });

  it('returns a first point with coordinates 0, 0', () => {
    assert.equal(points1[0].x, 0);
    assert.equal(points1[0].y, 0);
  });

  it('returns a second point where x value is equal to periodStart', () => {
    assert.equal(points1[1].x, projection1.periodStart);
  });

  it('returns a second point where y value is equal to periodStart * velocityStart', () => {
    assert.equal(points1[1].y, projection1.periodStart * projection1.velocityStart);
  });

  it('returns a third point where x value is calculated correctly', () => {
    const projection = {
      backlogSize: 6,
      darkMatter: 0,
      iterationLength: 0,

      periodStart: 2,
      periodEnd: 2,

      velocityStart: 1,
      velocityMiddle: 1,
      velocityEnd: 1,
    };
    const points = makePoints(projection);

    assert.equal(points[2].x, 4);
  });

  it('returns a third point where y value is calculated correctly', () => {
    const projection = {
      backlogSize: 6,
      darkMatter: 0,
      iterationLength: 0,

      periodStart: 2,
      periodEnd: 2,

      velocityStart: 1,
      velocityMiddle: 1,
      velocityEnd: 1,
    };
    const points = makePoints(projection);

    assert.equal(points[2].y, 4);
  });

  it('handles dark matter', () => {
    const projection = {
      backlogSize: 10,
      darkMatter: 50,
      iterationLength: 0,

      periodStart: 0,
      periodEnd: 0,

      velocityStart: 1,
      velocityMiddle: 1,
      velocityEnd: 1,
    };
    const points = makePoints(projection);

    assert.equal(points[3].y, 15);
  });

  it('returns the correct end point', () => {
    const projection = {
      backlogSize: 6,
      darkMatter: 0,
      iterationLength: 0,

      periodStart: 2,
      periodEnd: 2,

      velocityStart: 1,
      velocityMiddle: 1,
      velocityEnd: 1,
    };
    const points = makePoints(projection);

    assert.equal(points[3].x, 6);
    assert.equal(points[3].y, 6);
  });

  it('the date of the first point is the given start date', () => {
    const projection = {
      backlogSize: 6,
      darkMatter: 0,
      iterationLength: 0,

      periodStart: 2,
      periodEnd: 2,

      velocityStart: 1,
      velocityMiddle: 1,
      velocityEnd: 1,
    };
    const startDate = '15-Mar-07';
    const points = makePoints(projection, startDate);

    assert.equal(points[0].date, startDate);
  });

  it('the date for the second point is calculated correctly', () => {
    const projection = {
      backlogSize: 6,
      darkMatter: 0,
      iterationLength: 2,

      periodStart: 2,
      periodEnd: 2,

      velocityStart: 1,
      velocityMiddle: 1,
      velocityEnd: 1,
    };
    const startDate = '01-Mar-07';
    const points = makePoints(projection, startDate);

    assert.equal(points[1].date, '29-Mar-07');
  });

  it('the date for the third point is calculated correctly', () => {
    const projection = {
      backlogSize: 6,
      darkMatter: 0,
      iterationLength: 2,

      periodStart: 2,
      periodEnd: 2,

      velocityStart: 1,
      velocityMiddle: 1,
      velocityEnd: 1,
    };
    const startDate = '01-Mar-07';
    const points = makePoints(projection, startDate);

    assert.equal(points[2].date, '26-Apr-07');
  });

  it('the date for the last point is calculated correctly', () => {
    const projection = {
      backlogSize: 6,
      darkMatter: 0,
      iterationLength: 2,

      periodStart: 2,
      periodEnd: 2,

      velocityStart: 1,
      velocityMiddle: 1,
      velocityEnd: 1,
    };
    const startDate = '01-Mar-07';
    const points = makePoints(projection, startDate);

    assert.equal(points[3].date, '24-May-07');
  });
});
