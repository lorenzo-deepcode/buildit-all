const path = require('path');
const fs = require('fs-extra');
const version = require('../package.json').version;

const srcDir = path.resolve(__dirname, '../storybook-static');
const versionsDir = path.resolve(__dirname, `../storybook-hosted`);
const targetDir = `${versionsDir}/${version}`;
const configFile = `${versionsDir}/storybook-config.json`;

// First move the directory
fs.moveSync(srcDir, targetDir, { overwrite: true });
// Now edit the config
const configFileContent = fs.readJsonSync(configFile);
const versions = configFileContent.storybook.versions.availableVersions;

// Check that we don't have that version just yet
let versionFound = false;
for (let v of versions) {
  if (v === version) {
    versionFound = true;
    break;
  }
}

if (!versionFound) {
  versions.push(version);
}

fs.outputJsonSync(configFile, configFileContent, {spaces: 2});
