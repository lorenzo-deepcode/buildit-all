import mock from 'mock-fs';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';

import { disableLog } from 'lib/display';
import writeFiles, { fileEncodingType } from 'lib/generate/fs';

describe('local fs functions', () => {
  beforeEach(() => {
    disableLog();
    mock();
  });
  afterEach(() => {
    mock.restore();
  });

  it('writes a set of files poperly', () => {
    const files = {
      'myfile.txt': 'foo',
      'mydirectory/myfile2.txt': 'bar',
    };
    const files2 = {
      'myfile2.txt': 'baz',
    };
    writeFiles(files, '.');
    writeFiles(files2);
    expect(fs.existsSync(path.resolve('./myfile.txt'))).to.be.true;
    expect(fs.existsSync(path.resolve('./mydirectory/myfile2.txt'))).to.be.true;
    expect(fs.existsSync(path.resolve('./myfile2.txt'))).to.be.true;
  });
});

describe('fileEncodingType', () => {
  it('returns utf8 when correct', () => {
    const filename = 'foo.txt';
    expect(fileEncodingType(filename)).to.equal('utf8');
  });
  it('returns binary when correct', () => {
    const filename = 'foo.jpg';
    expect(fileEncodingType(filename)).to.equal('binary');
  });
});
