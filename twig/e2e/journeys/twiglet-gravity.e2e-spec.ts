import { browser } from 'protractor';

import { TwigPage } from '../PageObjects/app.po';
import {
  createDefaultJsonImportedTwiglet,
  deleteDefaultJsonImportedTwiglet,
  twigletName
} from '../utils';

describe('Gravity Points', () => {
  let page: TwigPage;

  beforeAll(() => {
    page = new TwigPage();
    page.navigateTo();
    page.header.twigletTab.deleteTwigletIfNeeded(twigletName, page);
    browser.waitForAngular();
    createDefaultJsonImportedTwiglet(page);
    browser.waitForAngular();
  });

  afterAll(() => {
    // browser.manage().logs().get('browser').then(function(browserLog) {
    //   console.log('log: ' + require('util').inspect(browserLog));
    // });
    deleteDefaultJsonImportedTwiglet(page);
  });

  describe('adding a gravity point', () => {
    beforeAll(() => {
      page.accordion.goToMenu('Gravity');
      page.accordion.gravityMenu.toggleGravityEditProcess();
    });

    it('pops up the edit gravity point modal', () => {
      page.twigletGraph.addGravityPoint();
      page.formForModals.fillInOnlyTextField('new name');
      page.formForModals.clickButton('Save Changes');
      page.formForModals.waitForModalToClose();
    });

    it('adds the gravity point', () => {
      expect(page.twigletGraph.gravityPointCount).toEqual(1);
    });
  });

  describe('editing a gravity point', () => {
    it('pops up the edit gravity modal', () => {
      page.twigletGraph.openEditGravityModal();
      expect(page.formForModals.modalTitle).toEqual('Gravity Point Editor');
    });

    it('can rename the gravity point', () => {
      page.formForModals.fillInOnlyTextField('new name');
      page.formForModals.clickButton('Save Changes');
      page.formForModals.waitForModalToClose();
      expect(page.twigletGraph.gravityPointName).toEqual('new name');
    });
  });

  describe('removing a gravity point', () => {
    it('can remove the gravity point', () => {
      page.twigletGraph.openEditGravityModal();
      page.formForModals.clickButton('Delete');
      expect(page.twigletGraph.gravityPointCount).toEqual(0);
    });
  });
});
