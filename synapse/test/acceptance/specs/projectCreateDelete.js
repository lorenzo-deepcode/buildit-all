import { expect } from 'chai';
import HomePage from '../pages/home';
import ProjectNew from '../pages/projectNew';
import ProjectEdit from '../pages/projectEdit';
import ProjectionPage from '../pages/projection';
import { driver } from '../global';
import randomstring from 'randomstring';


describe('Project Creation Process', () => {
  const testProjectName = randomstring.generate({
    length: 12,
    charset: 'alphabetic',
  });

  const homePage = new HomePage(driver);
  const projectPage = new ProjectNew(driver);
  const projectEdit = new ProjectEdit(driver, 'new-project');
  const projectionPage = new ProjectionPage(driver, testProjectName);

  it('Shows the new project list screen', function* foo() {
    projectPage.navigate();
    expect(yield projectPage.hasProjectList()).to.be.true;
  });

  it('Navigates to the manual creation screen', function* foo() {
    projectPage.selectManual();

    const currentUrl = yield projectPage.driver.getCurrentUrl();
    expect(currentUrl.endsWith('/new-project/edit')).to.equal(true);
  });

  it('Submits a new project', function* foo() {
    projectEdit.fillInName(testProjectName);
    expect(yield projectEdit.nameValue()).to.equal(testProjectName);
    yield projectEdit.saveProject();
  });

  it('Will not accept a second submission of the same project', function* foo() {
    const correctMessage = `Project ${testProjectName} already exists. Duplicates not permitted`;
    projectEdit.navigate();
    projectEdit.fillInName(testProjectName);
    yield projectEdit.saveProject();

    yield projectPage.waitForCondition(projectEdit.messageContent()
      .then(caption => caption === correctMessage));
    yield projectPage.waitForCondition(projectEdit.messageState().then(state => state === 'error'));
  });

  it('Displays a new projection message on the projection page', function* foo() {
    projectionPage.navigate();

    const correctMessage = 'You are creating a new projection';
    expect(yield projectionPage.messageContent()).to.equal(correctMessage);
  });

  it('Finds the new project in the homepage', function* foo() {
    homePage.navigate();
    homePage.login();
    homePage.navigate();
    expect(yield homePage.hasProjectTrashcan(testProjectName)).to.be.true;
  });

  it('Deletes the new project', function* foo() {
    yield homePage.deleteProject(testProjectName);
    expect(yield homePage.hasProjectTrashcan(testProjectName)).to.be.false;
  });

  it('Messages about the deletion properly', function* foo() {
    const correct = `Project ${testProjectName} deleted.`;
    expect(yield homePage.messageContent()).to.equal(correct);
  });
});
