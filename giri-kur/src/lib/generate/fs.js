import fs from 'fs';
import path from 'path';

import { log } from 'lib/display';

const buildDirectoryLocation = filePath => {
  if (fs.existsSync(filePath)) {
    return filePath;
  }

  const dirname = path.dirname(path.resolve(filePath));
  buildDirectoryLocation(dirname);
  log(`Creating ${filePath}`);
  fs.mkdirSync(filePath);
  return filePath;
};

export const fileEncodingType = filename => {
  let encoding = 'utf8';
  const extension = path.extname(filename);
  if (['.jpg', 'jpeg', '.png', '.gif'].indexOf(extension) !== -1) {
    encoding = 'binary';
  }
  return encoding;
};

const writeFiles = (filePackage, location = '') => {
  Object.keys(filePackage).forEach(filename => {
    const fullFilePath = path.resolve(location, filename);
    log(`Writing ${filename}`);
    buildDirectoryLocation(path.dirname(fullFilePath));

    const encoding = fileEncodingType(filename);
    fs.writeFileSync(fullFilePath, filePackage[filename], encoding);
  });
};
export default writeFiles;
