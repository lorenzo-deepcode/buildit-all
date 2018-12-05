import { By } from 'selenium-webdriver';
import PageBase from '../pageBase';

export default class Project extends PageBase {
  constructor(driver) {
    super(driver);
    const projectName = encodeURIComponent('Test Project 1');
    this.url = `${this.baseUrl}/${projectName}`;
    this.elements = {
      projectView: By.css('.project'),
      editLink: By.css(`a[href="${projectName}/edit"]`),
      projectionLink: By.css(`a[href="${projectName}/projection"]`),
      statusLink: By.css(`a[href="${projectName}/status"]`),
      homeLink: By.css('.header .logo'),
    };

    this.readyElement = this.elements.projectView;
  }

  hasProjectView() {
    return this.hasElement(this.elements.projectView);
  }

  hasEditLink() {
    return this.hasElement(this.elements.editLink);
  }

  hasProjectionLink() {
    return this.hasElement(this.elements.projectionLink);
  }

  hasStatusLink() {
    return this.hasElement(this.elements.statusLink);
  }

  clickEditProject() {
    const editLink = this.locateElement(this.elements.editLink);
    return editLink.click();
  }
}
