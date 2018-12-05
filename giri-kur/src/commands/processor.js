import { parse } from 'scss-parser';
import createQueryWrapper from 'query-ast';

import { processorHelp } from 'lib/help';
import readin from 'lib/readin';
import generateRulePackages from 'lib/generate/rulePackages';
import outputStyles from 'lib/output';
import * as display from 'lib/display';
import process from 'processors';
import * as types from 'processors/types';
import writeFiles from 'lib/generate/fs';
import path from 'path';

const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'console', alias: 'c', type: Boolean },
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'src', alias: 's', type: String, multiple: true, defaultOption: true },
  { name: 'dest', alias: 'd', type: String },
  { name: 'debugger', type: Boolean },
];
const options = commandLineArgs(optionDefinitions);

const processOptions = cliOptions => {
  if (cliOptions.console) {
    display.enableDisplay();
  }
  if (cliOptions.verbose) {
    display.enableLog();
  }
  if (cliOptions.debugger) {
    display.enableDebug();
  }
};

const addDefaults = src => (src);
// There's some funkiness that's coming from including this stuff.  Fix later.
// const addDefaults = src => (['node_modules/kiur/src/components', ...src]);

const readAndParseSource = src => {
  const content = readin(addDefaults(src)).join('');
  const ast = parse(content);
  return createQueryWrapper(ast);
};

const processTreeToData = $ => {
  const globals = [];
  const rules = [];

  $().children(n => n.node.type !== 'space').nodes.forEach(n => {
    const processed = process(n);
    if (processed.type === types.VARIABLE) {
      globals.push(processed.token);
    } else if (processed.selector) {
      const { selector, declarations } = processed;
      selector.forEach(s => {
        rules.push({ selector: s, declarations });
      });
    }
  });
  return { globals, rules };
};


if (options.help || !options.src || !options.dest) {
  processorHelp();
} else {
  processOptions(options);
  const $ = readAndParseSource(options.src);
  const processed = processTreeToData($);

  const globals = processed.globals;
  const rules = generateRulePackages(processed.rules);

  const styleFiles = outputStyles(globals, rules);

  writeFiles(styleFiles, path.join(options.dest, 'scss'));
}
