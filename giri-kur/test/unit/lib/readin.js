import mock from 'mock-fs';
import path from 'path';
import { expect } from 'chai';

import readin, { readinWithFilenames } from 'lib/readin';
import * as display from 'lib/display';

describe('readin lib', () => {
  const fooContents = '.foo { color: white; }';
  const barContents = '.bar { color: black; }';
  beforeEach(() => {
    display.disableLog();
    // IF YOU CHANGE THIS:
    // Make sure you update the 'reads in a directory and maintains filenames'
    // test below, because it has to modify this.
    mock({
      'foo.scss': fooContents,
      '.foo': fooContents,
      files: {
        'foo.scss': fooContents,
        'bar.scss': barContents,
      },
    });
  });
  afterEach(() => {
    mock.restore();
  });

  it('reads in nothing', () => {
    const results = readin();
    expect(results).to.deep.equal([]);
  });

  it('reads in a single file', () => {
    const results = readin('foo.scss');
    expect(results).to.deep.equal([fooContents]);
  });

  it('skips dotfiles', () => {
    const results = readin('.foo');
    expect(results).to.deep.equal([]);
  });

  it('reads in a directory', () => {
    const results = readin('files');
    expect(results).to.deep.equal([barContents, fooContents]);
  });

  it('reads in a directory and maintains filenames', () => {
    // Arrangement.  Maintaining filenames means maintaining complete filenames
    const fooname = path.resolve(process.cwd(), 'files', 'foo.scss');
    const barname = path.resolve(process.cwd(), 'files', 'bar.scss');
    const correct = {};
    correct[fooname] = fooContents;
    correct[barname] = barContents;

    const results = readinWithFilenames('files');
    expect(results).to.deep.equal(correct);

    const results2 = readinWithFilenames();
    expect(results2).to.deep.equal({});
  });
});
