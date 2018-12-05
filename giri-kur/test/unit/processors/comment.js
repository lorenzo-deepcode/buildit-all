import { expect } from 'chai';
import processComment from 'processors/comment';

const testComment = { type: 'comment_singleline',
  value: ' this is a comment',
  start: { cursor: 840, line: 26, column: 0 },
  next: { cursor: 863, line: 26, column: 23 } };

const correct = { type: 'COMMENT', value: testComment };

describe('Comment Processor', () => {
  it('Processes Properly', () => {
    const output = processComment(testComment);
    expect(output).to.deep.equal(correct);
  });
});
