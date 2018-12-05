import Admzip from 'adm-zip';
import tmp from 'tmp';
import childProcess from 'child_process';

import writeFiles from 'lib/generate/fs';

const download = url => (
  childProcess.execFileSync('curl', ['--silent', '-L', url], { encoding: 'binary' })
);

const unzipBuffer = buffer => {
  const zip = new Admzip(buffer);
  const entries = zip.getEntries();

  const files = {};
  entries.forEach(entry => {
    files[entry.entryName] = entry.getData();
  });

  const tempDir = tmp.dirSync();

  writeFiles(files, tempDir.name);
  return tempDir.name;
};

const downloadBrandAiFile = (account, brand, filename, key = null) => {
  const url = `https://assets.brand.ai/${account}/${brand}/${filename}?key=${key}`;
  return Buffer.from(download(url), 'binary');
};

export const downloadBrandAiVariables = (account, brand, key) => (
  downloadBrandAiFile(account, brand, '_style-params.scss', key)
);
export const downloadBrandAiImages = (account, brand, key) => (
  unzipBuffer(downloadBrandAiFile(account, brand, 'images.zip', key))
);
export const downloadBrandAiIcons = (account, brand, key) => (
  unzipBuffer(downloadBrandAiFile(account, brand, 'icons.zip', key))
);
export const downloadBrandAiLogos = (account, brand, key) => (
  unzipBuffer(downloadBrandAiFile(account, brand, 'logos.zip', key))
);
