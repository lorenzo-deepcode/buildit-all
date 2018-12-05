/** @module lib/readin */
import fs from 'fs';
import path from 'path';

import { fileEncodingType } from 'lib/generate/fs';
import { log } from 'lib/display';

import recursiveRead from 'recursive-readdir-sync';

const generateListOfFiles = inputFiles => {
  const raw = [];
  inputFiles.forEach(current => {
    if (current.match(/^\./)) {
      return;
    }
    const filename = path.normalize(current);

    if (fs.lstatSync(filename).isDirectory()) {
      raw.push(...recursiveRead(filename).filter(f => (!path.basename(f).match(/^\./))));
    } else {
      raw.push(filename);
    }
  });

  return raw.map(file => (path.resolve(file)));
};

const readAllFiles = filesList => (
  filesList.map(file => (fs.readFileSync(file, fileEncodingType(file))))
);

const readAllFilesAndMaintainNames = filesList => {
  const filesWithContents = {};

  filesList.forEach(file => {
    const encoding = fileEncodingType(file);
    const contents = fs.readFileSync(file, encoding);
    filesWithContents[file] = contents;
  });

  return filesWithContents;
};

/**
 * Reads in every file given and returns their contents
 * @param {string[]} src - Array of filenames and/or directories to input
 * @return {string[]} Array where each element is an individual file's contents
 */
const readin = (src = [], maintainFilenames = false) => {
  const inputFiles = typeof src === 'string' ? [src] : src;
  const fullFileList = generateListOfFiles(inputFiles);

  log(`Reading in ${fullFileList.length} file${fullFileList.length === 1 ? '' : 's'}`);
  return maintainFilenames
    ? readAllFilesAndMaintainNames(fullFileList)
    : readAllFiles(fullFileList);
};

export const readinWithFilenames = (src = []) => (readin(src, true));

export default readin;
