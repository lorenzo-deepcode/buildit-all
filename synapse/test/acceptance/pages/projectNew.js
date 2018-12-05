import { By } from 'selenium-webdriver';
import PageBase from '../pageBase';

export default class ProjectNew extends PageBase {
  constructor(driver) {
    super(driver);
    this.url = `${this.baseUrl}/new`;
    this.elements = {
      manualButton: By.css('#createManually'),
      list: By.css('#newProjectsTable'),
    };
    this.readyElement = this.elements.list;
  }

  hasProjectList() {
    return this.hasElement(this.elements.list);
  }

  selectManual() {
    const manualButton = this.locateElement(this.elements.manualButton);
    return manualButton.click();
  }

}
