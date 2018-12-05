import Api from 'api';
import { fetch } from 'api/xhr';

import sinon from 'sinon';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;
chai.should();

import xhr from 'xhr';

// In here, we're only testing fetch(), because what we're really testing is makeRequest
// and that's the same for everything.  The API tests verify that fetch/put/post all
// create makeRequest calls properly.
describe('XHR Wrapper', () => {
  const pendingRequests = [];
  const testUrl = 'http://example.com';
  const successMessage = 'Hooray!';
  const successContent = { message: successMessage };
  const successfulResponse = [
    200,
    { 'Content-Type': 'application/json' },
    JSON.stringify(successContent),
  ];
  const successfulResponsePlain = [
    200,
    { 'Content-Type': 'text/html' },
    successMessage,
  ];
  const errorMessage = 'Boo!';
  const errorResponse = [
    401,
    { 'Content-Type': 'application/json' },
    `{"error": {"message": "${errorMessage}"}}`,
  ];

  beforeEach(() => {
    xhr.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

    pendingRequests.length = 0;
    xhr.XMLHttpRequest.onCreate = currentXhr => {
      pendingRequests.push(currentXhr);
    };
  });
  afterEach(() => {
    xhr.XMLHttpRequest.restore();
  });

  it('handles fetch successes properly', () => {
    const response = fetch(testUrl);
    pendingRequests[0].respond(...successfulResponse);
    return response.should.eventually.deep.equal(successContent);
  });
  it('handles fetch successes without json properly', () => {
    const response = fetch(testUrl);
    pendingRequests[0].respond(...successfulResponsePlain);
    return response.should.eventually.equal(successMessage);
  });
  it('handles fetch failures properly', () => {
    const response = fetch(testUrl);
    pendingRequests[0].respond(...errorResponse);
    return response.should.be.rejectedWith(errorMessage);
  });
  it('handles remote server failures properly', () => {
    const clock = sinon.useFakeTimers();
    const response = fetch(testUrl);
    clock.tick(100000);
    return response.should.be.rejectedWith('XMLHttpRequest timeout');
  });
});

describe('API', () => {
  const projectName = 'project-name';
  const projectData = { name: projectName };

  const pendingRequests = [];
  beforeEach(() => {
    xhr.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

    pendingRequests.length = 0;
    xhr.XMLHttpRequest.onCreate = currentXhr => {
      pendingRequests.push(currentXhr);
    };
  });
  afterEach(() => {
    xhr.XMLHttpRequest.restore();
  });

  it('runs the all projects request', () => {
    Api.projects();
    const theRequest = pendingRequests[0];
    expect(theRequest.method).to.equal('GET');
    expect(theRequest.url.match('/project/$')).to.not.equal(null);
  });

  it('runs the single project request', () => {
    Api.project(projectName);
    const theRequest = pendingRequests[0];
    expect(theRequest.method).to.equal('GET');
    expect(theRequest.url.match(`/project/${projectName}$`)).to.not.equal(null);
  });

  it('runs the demand request', () => {
    Api.projectDemandSummary(projectName);
    const theRequest = pendingRequests[0];
    expect(theRequest.method).to.equal('GET');
    expect(theRequest.url.match(`/project/${projectName}/demand/summary$`)).to.not.equal(null);
  });

  it('runs the defect request', () => {
    Api.projectDefectSummary(projectName);
    const theRequest = pendingRequests[0];
    expect(theRequest.method).to.equal('GET');
    expect(theRequest.url.match(`/project/${projectName}/defect/summary$`)).to.not.equal(null);
  });

  it('runs the effort request', () => {
    Api.projectEffortSummary(projectName);
    const theRequest = pendingRequests[0];
    expect(theRequest.method).to.equal('GET');
    expect(theRequest.url.match(`/project/${projectName}/effort/summary$`)).to.not.equal(null);
  });

  it('runs the starter project request', () => {
    Api.starterProjects();
    const theRequest = pendingRequests[0];
    expect(theRequest.method).to.equal('GET');
    expect(theRequest.url.match('/project\\?status=available$')).to.not.equal(null);
  });

  it('runs the projection saver', () => {
    Api.saveProjection(projectData, projectName);
    const theRequest = pendingRequests[0];
    expect(theRequest.method).to.equal('PUT');
    expect(theRequest.url.match(`/project/${projectName}/projection$`)).to.not.equal(null);
    expect(theRequest.requestBody).to.equal(JSON.stringify(projectData));
  });

  it('runs the project updater', () => {
    Api.updateProject(projectData);
    const theRequest = pendingRequests[0];
    expect(theRequest.method).to.equal('PUT');
    expect(theRequest.url.match(`/project/${projectName}$`)).to.not.equal(null);
    expect(theRequest.requestBody).to.equal(JSON.stringify(projectData));
  });

  it('runs the project saver', () => {
    Api.saveProject(projectData);
    const theRequest = pendingRequests[0];
    expect(theRequest.method).to.equal('POST');
    expect(theRequest.url.match(`/project/${projectName}$`)).to.not.equal(null);
    expect(theRequest.requestBody).to.equal(JSON.stringify(projectData));
  });

  it('runs the project deleter', () => {
    Api.deleteProject(projectData);
    const theRequest = pendingRequests[0];
    expect(theRequest.method).to.equal('DELETE');
    expect(theRequest.url.match(`/project/${projectName}$`)).to.not.equal(null);
  });

  it('runs the event history request', () => {
    Api.projectEventHistory(projectName);
    const theRequest = pendingRequests[0];
    expect(theRequest.method).to.equal('GET');
    expect(theRequest.url.match(`/project/${projectName}/event`)).to.not.equal(null);
  });

  it('runs the rag status request', () => {
    Api.projectRagStatusSummary(projectName);
    const theRequest = pendingRequests[0];
    expect(theRequest.method).to.equal('GET');
    expect(theRequest.url.match(`/project/${projectName}/status`)).to.not.equal(null);
  });
});
