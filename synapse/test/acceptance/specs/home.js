import { expect } from 'chai';
import HomePage from '../pages/home';
import ProjectPage from '../pages/project';
import { driver } from '../global';

describe('Home Page', () => {
  const homePage = new HomePage(driver);
  const projectPage = new ProjectPage(driver);

  beforeEach(() => homePage.navigate());

  it('Shows the home screen', function* foo() {
    expect(yield driver.getTitle()).to.equal('Synapse');
    expect(yield homePage.hasApp()).to.be.true;
    expect(yield homePage.hasTable()).to.be.true;
    expect(yield homePage.hasLogin()).to.be.true;
  });

  it('Can navigate to the Project View page', function* foo() {
    // setup
    const projectName = 'Test Project 1';

    // act
    homePage.selectProject(projectName);

    // assert
    expect(yield projectPage.hasProjectView()).to.be.true;
  });
});
