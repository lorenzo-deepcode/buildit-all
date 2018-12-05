const debug = require('debug')("metalsmith-glossary");
const multimatch = require('multimatch');
const path = require('path');

function findMatchingFilename(filenames, name) {
  return filenames.find(
    filename => {
      const parsedFilename = path.parse(filename);
      return parsedFilename.name === name;
    }
  );
}

function findMatchingFile(files, filenames, name) {
  const foundFilename = findMatchingFilename(filenames, name);
  if (foundFilename) {
    return files[foundFilename];
  }
  return undefined;
}

module.exports = function({ pattern }) {
  return function(files, metalsmith, done) {
    const allFileNames = Object.keys(files);
    const glossaryFileNames = multimatch(allFileNames, pattern);

    glossaryFileNames.forEach(filename => {
      debug('checking file: %s', filename);
      const file = files[filename];

      if (file.synonymFor) {
        const forFile = findMatchingFile(files, allFileNames, file.synonymFor);
        debug('"%s" is a synonym for: "%s"', file.title, forFile.title);

        // Add 'synonym' reference from source to dest
        file.synonym = forFile;

        // Append source to 'synonyms' arrary in dest
        if( forFile.synonyms ) {
          forFile.synonyms.push(file);
        }
        else {
          forFile.synonyms = [file];
        }
      }

    });
    done();
  }
};
