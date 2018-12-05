import {By, Builder, logging, until} from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import assert from "assert";

const url = process.env.URL || 'http://localhost:8000/#';
const options = new chrome.Options();
options.addArguments('no-sandbox');

describe('Basic tests', () => {
  var driver;

  before(() => {
    driver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build()
  });
  
  after(() => driver.quit());

  it('home shows TBD', () => {
    driver.navigate().to(url);
    return driver.wait(until.elementLocated(By.css('div.notice')), 5000).then(tbd =>
      tbd.getText().then(value => assert.equal(value, 'TBD')))
  });
});

