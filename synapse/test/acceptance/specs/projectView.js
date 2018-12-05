import { expect } from 'chai';
import ProjectPage from '../pages/project';
import { driver } from '../global';

describe('Project View Page', () => {
  const projectPage = new ProjectPage(driver);

  beforeEach(() => projectPage.navigate());

  it('Shows the project view screen', function* foo() {
    expect(yield projectPage.hasProjectView()).to.be.true;
  });
});
