import trimTextInput from 'helpers/trimTextInput';
const should = require('chai').should();

describe('Text input trimmer', () => {
  it('Removes one space from the end of an input string', () => {
    const trimmedInput = trimTextInput('Hey ');
    should.equal(trimmedInput, 'Hey');
  });

  it('Removes multiple spaces from the end of an input string', () => {
    const trimmedInput = trimTextInput('Hey   ');
    should.equal(trimmedInput, 'Hey');
  });

  it('Removes spaces from the beginning of an input string', () => {
    const trimmedInput = trimTextInput('   Hey');
    should.equal(trimmedInput, 'Hey');
  });

  it('Leaves spaces inside the string intact', () => {
    const trimmedInput = trimTextInput('Hey there ');
    should.equal(trimmedInput, 'Hey there');
  });
});
