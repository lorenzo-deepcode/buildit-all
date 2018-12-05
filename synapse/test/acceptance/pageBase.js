import { By, until } from 'selenium-webdriver';
import { url } from './global';

export default class PageBase {
  constructor(driver) {
    this.baseUrl = url;

    driver.manage().timeouts().implicitlyWait(10000);
    this.driver = driver;
  }

  waitUntilReady() {
    if (this.readyElement) {
      return this.driver.wait(until.elementLocated(this.readyElement));
    }
    return this.driver.wait();
  }

  clickWhenClickable(element) {
    return this.driver.wait(() =>
      element.click()
        .then(() => true)
        .catch(() => false)
    );
  }

  navigate() {
    this.driver.navigate().to(this.url);
    return this.waitUntilReady();
  }

  login() {
    const data = JSON.stringify({ name: 'foo@bar.com' });
    return this.driver.executeScript(`window.localStorage.setItem('user','${data}');`);
  }

  hasElement(element) {
    return this.driver.findElement(element)
      .isDisplayed()
      .catch(() => false);
  }

  hasNoElement(element) {
    return this.driver.wait(
      () => this.driver.findElements(element).then(arr => arr.length === 0));
  }

  waitForCondition(condition) {
    return this.driver.wait(condition);
  }

  locateElement(element, delay = 10000) {
    return this.driver.wait(until.elementLocated(element), delay);
  }

  messageContent() {
    return this.driver.findElement(By.css('.message-bar .message-text')).getText();
  }
  messageState() {
    const messageBar = this.driver.findElement(By.css('.message-bar'));
    return messageBar.getAttribute('class').then(
      (classes) => (classes.match('error') ? 'error' : 'success')
    );
  }


}
