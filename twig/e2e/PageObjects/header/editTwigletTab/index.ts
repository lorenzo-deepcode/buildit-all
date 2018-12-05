import { browser, by, element, ElementFinder } from 'protractor';

import { Header } from './../';
import { iconsObject } from '../../../../src/non-angular/utils/icons';

export class EditTwigletTab {

  // self: ElementFinder;
  icons: Object;

  constructor(private header: Header) {
    // this.self = element(by.css('app-header-twiglet-edit'));
    this.icons = iconsObject();
  }

  get mode() {
    const self = element(by.css('app-header-twiglet'));
    return this.header.activeTab.then(activeTabText => {
      if (activeTabText !== 'Edit') {
        return 'viewing';
      }
      return self.isElementPresent(by.cssContainingText('button', `Edit`))
      .then(present => present ? 'editing' : 'viewing');
    });
  }

  startTwigletEditProcess() {
    const self = element(by.css('app-header-twiglet'));
    const button = self.element(by.cssContainingText('button', 'Edit'));
    button.click();
  }

  startTwigletModelEditProcess() {
    const self = element(by.css('app-header-twiglet'));
    const tab = self.element(by.cssContainingText('span.edit-tab', `Twiglet's Model`));
    tab.click();
  }

  switchToTwigletEditProcess() {
    const self = element(by.css('app-header-twiglet'));
    const tab = self.element(by.cssContainingText('span.edit-tab', 'Twiglet'));
    tab.click();
  }

  copyNode() {
    const self = element(by.css('app-header-twiglet-edit'));
    const button = self.element(by.css('.fa.fa-clone'));
    button.click();
  }

  pasteNode() {
    const self = element(by.css('app-header-twiglet-edit'));
    const button = self.element(by.css('.fa.fa-clipboard'));
    button.click();
  }

  addNodeByTooltip(tooltip, location?: { x: number, y: number }) {
    const button = element(by.xpath(`//app-header-twiglet-edit//button[@type='${tooltip}']`));
    if (location) {
      return browser.driver.actions().dragAndDrop(button, location).perform();
    }
    const target = element(by.css('app-twiglet-graph'));
    return browser.driver.actions().dragAndDrop(button, target).perform();
  }


  saveEdits() {
    const self = element(by.css('app-header-twiglet'));
    const button = self.element(by.cssContainingText('button', 'Save'));
    button.click();
  }

  cancelEditProcess() {
    const self = element(by.css('app-header-twiglet'));
    const button = self.element(by.cssContainingText('button', 'Cancel'));
    button.click();
  }
}
