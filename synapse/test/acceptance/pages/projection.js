import { By } from 'selenium-webdriver';
import PageBase from '../pageBase';

export default class ProjectionPage extends PageBase {
  constructor(driver, projectName) {
    super(driver);
    this.url = `${this.baseUrl}/${projectName}/projection`;
    this.elements = {
      chart: By.css('svg.chart'),
    };

    this.readyElement = this.elements.chart;
  }
}
