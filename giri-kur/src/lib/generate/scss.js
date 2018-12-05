/** @module lib/generate/scss */
import path from 'path';

import formatGlobal from 'formatters/global';
import formatRule from 'formatters/rule';

const tokenDirectoryName = 'components';
export const mainFile = 'main.scss';
export const variableFile = '_variables.scss';
export const scssDirectory = 'scss';

const atomicStructure = {
  atom: '1-Atoms',
  molecule: '2-Molecules',
  organism: '3-Organisms',
  template: '4-Templates',
  page: '5-Pages',
};
const defaultAtomicLevel = 'atom';


const resolveAtomicDirectoryName = level => (atomicStructure[level]);
const resolveAtomicDirectory = (level, filename) => (
  path.join(tokenDirectoryName, resolveAtomicDirectoryName(level), filename)
);

const componentFileContents = (selector, rules) => ({
  filename: resolveAtomicDirectory(defaultAtomicLevel, `_${selector}.scss`),
  rule: formatRule(selector, rules),
});

const globalsFileContents = globals => globals.join('\n');

const mainFileContents = fileNames => (fileNames.map(f => `@import "${f}";`).join('\n'));

/**
 * Outputs a collection of SCSS files
 * @param {Object[]} rules - Rules
 * @param {Object[]} globals - Global definitions
 */
const generateScss = (globals, rules) => {
  const outputFiles = {};

  const globalsContents = globalsFileContents([].concat(...globals.map(g => formatGlobal(g))));
  if (globalsContents.length) {
    const globalFilename = path.join(variableFile);
    outputFiles[globalFilename] = globalsContents;
  }

  Object.keys(rules).forEach(k => {
    const { filename, rule } = componentFileContents(k, rules[k]);
    outputFiles[filename] = rule;
  });

  outputFiles[mainFile] = mainFileContents(Object.keys(outputFiles));

  return outputFiles;
};
export default generateScss;
