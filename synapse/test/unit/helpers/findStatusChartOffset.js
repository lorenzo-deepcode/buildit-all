import findStatusChartOffset from 'helpers/findStatusChartOffset';
const should = require('chai').should();

describe('Status chart offset calculator', () => {
  it('Returns an array of same length as the input array', () => {
    const spacing = 100;
    const input = [
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
    ];
    const result = findStatusChartOffset(input, spacing);
    should.equal(result.length, 5);
  });

  it('Handles three chartable datasets', () => {
    const spacing = 100;
    const input = [
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
    ];
    const result = findStatusChartOffset(input, spacing);
    should.equal(result[0], 0);
    should.equal(result[1], 100);
    should.equal(result[2], 200);
  });

  it('Handles the case where the middle dataset is unchartable', () => {
    const spacing = 100;
    const input = [
      [1, 2, 3],
      [],
      [1, 2, 3],
    ];
    const result = findStatusChartOffset(input, spacing);
    should.equal(result[0], 0);
    should.equal(result[1], 0);
    should.equal(result[2], 100);
  });

  it('Handles the case where the first dataset is unchartable', () => {
    const spacing = 100;
    const input = [
      [],
      [1, 2, 3],
      [1, 2, 3],
    ];
    const result = findStatusChartOffset(input, spacing);
    should.equal(result[0], 0);
    should.equal(result[1], 0);
    should.equal(result[2], 100);
  });

  it('Handles the case where the first two datasets are unchartable', () => {
    const spacing = 100;
    const input = [
      [],
      [],
      [1, 2, 3],
    ];
    const result = findStatusChartOffset(input, spacing);
    should.equal(result[0], 0);
    should.equal(result[1], 0);
    should.equal(result[2], 0);
  });
});
