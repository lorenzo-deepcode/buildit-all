import { parse } from 'scss-parser';
import createQueryWrapper from 'query-ast';

import {
  downloadBrandAiVariables,
  downloadBrandAiImages,
  downloadBrandAiIcons,
  downloadBrandAiLogos,
} from 'lib/download';
import { brandaiHelp } from 'lib/help';
import readin, { readinWithFilenames } from 'lib/readin';
import * as display from 'lib/display';
import process from 'processors';
import * as types from 'processors/types';
import writeFiles from 'lib/generate/fs';
import path from 'path';
import changeCase from 'change-case';
import fingerprint from 'fingerprinting';

import { mainFile, variableFile, scssDirectory } from 'lib/generate/scss';

import formatAtrule from 'formatters/atrule';
import formatGlobal from 'formatters/global';
import processVariable from 'processors/variable';

const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'console', alias: 'c', type: Boolean },
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'src', alias: 's', type: String, defaultOption: true },
  { name: 'debugger', type: Boolean },
  { name: 'cdn', type: String },
  { name: 'account', type: String },
  { name: 'brand', type: String },
  { name: 'key', type: String },
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

const processTreeToData = $ => {
  const globals = [];
  const whatever = [];

  $().children(n => n.node.type !== 'space').nodes.forEach(n => {
    const processed = process(n);
    if (processed.type === types.VARIABLE) {
      globals.push(processed.token);
    } else if (processed.type === types.COMMENT) {
      // Do nothing
    } else {
      whatever.push(processed);
    }
  });
  return { globals, whatever };
};

const parseSource = src => (createQueryWrapper(parse(src)));

const retrieveBrandAiConfig = (account, brand, key) => {
  const variableData = downloadBrandAiVariables(account, brand, key);
  const imagesDir = downloadBrandAiImages(account, brand, key);
  const logosDir = downloadBrandAiLogos(account, brand, key);
  const iconsDir = downloadBrandAiIcons(account, brand, key);
  return { variableData, imagesDir, logosDir, iconsDir };
};

const addBrandAiToMain = main => {
  let alreadyIncluded = false;
  const finalizedMain = main;
  main.forEach(r => {
    if (r.keyword && r.keyword === '@import' && r.arguments && r.arguments === '_style-params.scss') {
      alreadyIncluded = true;
    }
  });
  if (!alreadyIncluded) {
    finalizedMain.unshift({ keyword: '@import', arguments: '_style-params.scss' });
  }
  return finalizedMain;
};

const openMainScssFile = () => {
  const contents = readin(`${options.src}/${scssDirectory}/${mainFile}`);
  const { whatever: parsed } = processTreeToData(parseSource(contents[0]));
  return parsed;
};

const openGlobalScssFile = () => {
  const contents = readin(`${options.src}/${scssDirectory}/${variableFile}`);
  const { globals } = processTreeToData(parseSource(contents[0]));
  return globals;
};

const processFiles = (files, type) => {
  const BRANDAI_PREFIX = `brandai-${type}-`;
  const processedFiles = [];

  Object.keys(files).forEach(filename => {
    const basename = path.basename(filename);
    const extension = path.extname(filename);
    const name = path.basename(filename, extension);
    const variable = processVariable({ value: `${BRANDAI_PREFIX}${changeCase.paramCase(name)}` });
    const fingerprinted = fingerprint(basename, { content: files[filename] });

    processedFiles.push({
      name,
      extension,
      variable,
      fingerprinted: fingerprinted.file,
      content: files[filename],
    });
  });

  return processedFiles;
};

const writeAssetFiles = (files, type) => {
  const assetsToWrite = {};
  const newGlobals = {};

  const cdn = options.cdn ? options.cdn : '';

  files.forEach(file => {
    const assetPath = path.join(`/assets/${type}`, file.fingerprinted);
    newGlobals[file.variable] = `url("${cdn}${assetPath}")`;
    assetsToWrite[file.fingerprinted] = file.content;
  });

  writeFiles(assetsToWrite, path.join(`./${options.src}/assets/${type}`));

  return newGlobals;
};

const openFilesDirectory = directory => (readinWithFilenames(directory));
const incorporateFiles = (directory, type) => {
  const assets = openFilesDirectory(directory);
  const files = processFiles(assets, type);
  return writeAssetFiles(files, type);
};

const incorporateImages = (directory) => (incorporateFiles(directory, 'images'));
const incorporateIcons = (directory) => (incorporateFiles(directory, 'icons'));
const incorporateLogos = (directory) => (incorporateFiles(directory, 'logos'));

if (options.help || !options.src) {
  brandaiHelp();
} else {
  processOptions(options);

  const config = retrieveBrandAiConfig(options.account, options.brand, options.key);

  const parsedMain = openMainScssFile();
  const updated = addBrandAiToMain(parsedMain);

  const globals = Object.assign(...openGlobalScssFile());

  const images = incorporateImages(config.imagesDir);
  const icons = incorporateIcons(config.iconsDir);
  const logos = incorporateLogos(config.logosDir);
  Object.assign(globals, images, icons, logos);

  writeFiles({
    'main.scss': updated.map(p => formatAtrule(p)).join('\n'),
    '_variables.scss': formatGlobal(globals).join('\n'),
    '_style-params.scss': config.variableData,
  }, `./${options.src}/${scssDirectory}`);
  display.debug(formatGlobal(globals));
}
