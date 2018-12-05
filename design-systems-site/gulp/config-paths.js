const path = require('path');

const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir,'dist');

module.exports = {
  // Source code
  srcDir,
  srcContentFiles: path.join(srcDir, 'content', '**', '*.md'),
  srcTemplatesDir: path.join(srcDir, 'templates'),

  // Build output
  distDir,
  distFiles: path.join(distDir, '**', '*'),
};
