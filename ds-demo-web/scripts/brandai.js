const fs = require('fs');
const download = require('download');
const extract = require('extract-zip');
const brandaiConfig = require('../brandai.config');
const chalk = require('chalk');
const log = console.log;

const brandai = brandaiConfig.default;

const assetsDir = 'src/assets';
// The logos
log(`${chalk.white('Downloading logos from ')} ${chalk.blue(brandai.logos)}`);
download(brandai.logos)
  .then(data => {
    const out = `${assetsDir}/logo.zip`
    fs.writeFileSync(out, data);
    extract(out, {dir: assetsDir}, (err) => {
      if (err) {
        log(chalk.red.dim('Error downloading logos '), chalk.red(err));
      } else {
        log(chalk.green.dim('Logo unzip done'));
      }
      fs.unlinkSync(out);
    });
    log(chalk.green.dim('Done downloading logos'));
  });

  download(brandai.styles)
    .then(data => {
      const out = `${assetsDir}/styles.less`
      fs.writeFileSync(out, data);
      log(chalk.green.dim('Done downloading styles'));
    });
