import fs from 'fs';
import { Builder, logging } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

const options = new chrome.Options();
options.addArguments('no-sandbox');

const driver = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();
const url = process.env.URL || 'http://localhost:3000';
logging.installConsoleHandler();

const clickWhenClickable = (element) =>
  driver.wait(() =>
    element.click()
      .then(() => true)
      .catch(() => false));

afterEach(function checkForFailure(done) {
  if (this.currentTest.state === 'failed') {
    driver.takeScreenshot().then((data) => {
      fs.mkdir('./screenshots', (err) => {
        if (!err || err.code === 'EEXIST') {
          const testFileName = this.currentTest.fullTitle().replace(/[^a-z0-9]/gi, '-');
          fs.writeFile(`./screenshots/${testFileName}.png`, data, 'base64', (error) => {
            if (error) throw error;
            done();
          });
        } else throw err;
      });
    });
  } else done();
});

after(() => driver.quit());

export { driver, url, clickWhenClickable };
