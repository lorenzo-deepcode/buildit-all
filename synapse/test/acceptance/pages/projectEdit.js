import { By } from 'selenium-webdriver';
import PageBase from '../pageBase';

export default class ProjectEdit extends PageBase {
  constructor(driver, rawProjectName = 'Test Project 1') {
    super(driver);
    const projectName = encodeURIComponent(rawProjectName);
    this.url = `${this.baseUrl}/${projectName}/edit`;
    this.elements = {
      component: By.css('.edit-project'),
      nameField: By.css('#headername'),
      saveButton: By.css('#top-save-button'),
    };

    this.readyElement = this.elements.component;
  }

  hasProjectEdit() {
    return this.hasElement(this.elements.component);
  }

  fillInName(value) {
    return this.driver.findElement(this.elements.nameField).sendKeys(value);
  }

  nameValue() {
    return this.driver.findElement(this.elements.nameField).getAttribute('value');
  }

  saveProject() {
    const manualButton = this.locateElement(this.elements.saveButton);
    return manualButton.click();
  }
}
