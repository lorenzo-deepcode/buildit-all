const expect = require('chai').expect;
import * as actions from 'actions/actions';
import * as functions from 'actions';

describe('Redux actions', () => {
  it('receiveProjects', () => {
    const response = 'test';
    const correct = {
      type: actions.FETCH_PROJECTS_RECEIVE,
      response,
    };
    expect(functions.receiveProjects(response)).to.deep.equal(correct);
  });

  it('receiveStarterProjects', () => {
    const response = 'test';
    const correct = {
      type: actions.FETCH_STARTER_PROJECTS_RECEIVE,
      response,
    };
    expect(functions.receiveStarterProjects(response)).to.deep.equal(correct);
  });

  it('fetchProjects', () => {
    const correct = {
      type: actions.FETCH_PROJECTS,
    };
    expect(functions.fetchProjects()).to.deep.equal(correct);
  });

  it('fetchStarterProjects', () => {
    const correct = {
      type: actions.FETCH_STARTER_PROJECTS_REQUEST,
    };
    expect(functions.fetchStarterProjects()).to.deep.equal(correct);
  });

  it('fetchProject', () => {
    const name = 'test';
    const correct = {
      type: actions.FETCH_PROJECT_REQUEST,
      name,
    };
    expect(functions.fetchProject(name)).to.deep.equal(correct);
  });

  it('saveFormData', () => {
    const project = 'test';
    const correct = {
      type: actions.SAVE_PROJECT_REQUEST,
      project,
      destination: undefined,
    };
    const correct2 = Object.assign({}, correct);
    correct2.destination = '/';

    expect(functions.saveFormData(project)).to.deep.equal(correct);
    expect(functions.saveFormData(project, '/')).to.deep.equal(correct2);
  });

  it('initializeNewProject', () => {
    const harvestId = 'test';
    const correct = {
      type: actions.INITIALIZE_NEW_PROJECT,
      harvestId,
    };
    expect(functions.initializeNewProject(harvestId)).to.deep.equal(correct);
  });

  it('onInputChange', () => {
    const section = 'test';
    const key = 'test 2';
    const value = 'test 3';
    const correct = {
      type: actions.UPDATE_FORM_DATA,
      section,
      key,
      value,
    };
    expect(functions.onInputChange(section, key, value)).to.deep.equal(correct);
  });

  it('initializeFormData', () => {
    const project = 'test';
    const correct = {
      type: actions.INITIALIZE_FORM_DATA,
      project,
    };
    expect(functions.initializeFormData(project)).to.deep.equal(correct);
  });

  it('onListItemRemove', () => {
    const section = 'test';
    const list = 'test 2';
    const index = 'test 3';
    const correct = {
      type: actions.REMOVE_LIST_ITEM,
      section,
      list,
      index,
    };
    expect(functions.onListItemRemove(section, list, index)).to.deep.equal(correct);
  });

  it('addItemToDemandFlowList', () => {
    const name = 'test';
    const correct = {
      type: actions.ADD_DEMAND_FLOW_LIST_ITEM,
      name,
    };
    expect(functions.addItemToDemandFlowList(name)).to.deep.equal(correct);
  });

  it('addItemToDefectFlowList', () => {
    const name = 'test';
    const correct = {
      type: actions.ADD_DEFECT_FLOW_LIST_ITEM,
      name,
    };
    expect(functions.addItemToDefectFlowList(name)).to.deep.equal(correct);
  });

  it('addItemToRoleList', () => {
    const name = 'test';
    const groupWith = 'test 2';
    const correct = {
      type: actions.ADD_ROLE_LIST_ITEM,
      name,
      groupWith,
    };
    expect(functions.addItemToRoleList(name, groupWith)).to.deep.equal(correct);
  });

  it('addItemToSeverityList', () => {
    const name = 'test';
    const groupWith = 'test 2';
    const correct = {
      type: actions.ADD_SEVERITY_LIST_ITEM,
      name,
      groupWith,
    };
    expect(functions.addItemToSeverityList(name, groupWith)).to.deep.equal(correct);
  });

  it('moveListItemUp', () => {
    const section = 'test';
    const list = 'test 2';
    const index = 'test 3';
    const correct = {
      type: actions.MOVE_LIST_ITEM_UP,
      section,
      list,
      index,
    };
    expect(functions.moveListItemUp(section, list, index)).to.deep.equal(correct);
  });

  it('moveListItemDown', () => {
    const section = 'test';
    const list = 'test 2';
    const index = 'test 3';
    const correct = {
      type: actions.MOVE_LIST_ITEM_DOWN,
      section,
      list,
      index,
    };
    expect(functions.moveListItemDown(section, list, index)).to.deep.equal(correct);
  });

  it('setMessage', () => {
    const message = 'test';
    const correct = {
      type: actions.SET_MESSAGE,
      message,
    };
    expect(functions.setMessage(message)).to.deep.equal(correct);
  });

  it('creates the correct action for setErrorMessage', () => {
    const message = 'test';
    const correct = {
      type: actions.SET_MESSAGE,
      messageType: 'ERROR',
      message,
    };
    expect(functions.setErrorMessage(message)).to.deep.equal(correct);
  });

  it('throws an error when setErrorMessage receives an error object', () => {
    const message = new Error('Oops, not how you do it.');
    function tryToSetErrorMessage() {
      functions.setErrorMessage(message);
    }
    expect(tryToSetErrorMessage).to.throw();
  });

  it('clearMessage', () => {
    const message = '';
    const correct = {
      type: actions.SET_MESSAGE,
      message,
    };
    expect(functions.clearMessage(message)).to.deep.equal(correct);
  });

  it('fetchProjection', () => {
    const name = 'test';
    const correct = {
      type: actions.FETCH_PROJECTION_REQUEST,
      name,
    };
    expect(functions.fetchProjection(name)).to.deep.equal(correct);
  });

  it('fetchProjectSuccess', () => {
    const project = 'test';
    const correct = {
      type: actions.FETCH_PROJECT_SUCCESS,
      project,
    };
    expect(functions.fetchProjectSuccess(project)).to.deep.equal(correct);
  });

  it('saveProjection', () => {
    const projection = 'test';
    const name = 'test 2';
    const correct = {
      type: actions.SAVE_PROJECTION_REQUEST,
      projection,
      name,
    };
    expect(functions.saveProjection(projection, name)).to.deep.equal(correct);
  });

  it('updateProjection', () => {
    const projection = 'test';
    const correct = {
      type: actions.UPDATE_PROJECTION,
      projection,
    };
    expect(functions.updateProjection(projection)).to.deep.equal(correct);
  });

  it('updateProject', () => {
    const project = 'test';
    const correct = {
      type: actions.UPDATE_PROJECT_REQUEST,
      project,
    };
    expect(functions.updateProject(project)).to.deep.equal(correct);
  });

  it('deleteProject', () => {
    const name = 'a project';
    const correct = {
      type: actions.DELETE_PROJECT,
      name,
    };
    expect(functions.deleteProject(name)).to.deep.equal(correct);
  });

  it('deleteProjectSuccess', () => {
    const name = 'a project';
    const correct = {
      type: actions.DELETE_PROJECT_SUCCESS,
      name,
    };
    expect(functions.deleteProjectSuccess(name)).to.deep.equal(correct);
  });

  it('dismissMessage', () => {
    const correct = {
      type: actions.SET_MESSAGE,
      message: '',
    };
    expect(functions.dismissMessage()).to.deep.equal(correct);
  });

  it('resetProject', () => {
    const correct = {
      type: actions.RESET_PROJECT,
    };
    expect(functions.resetProject()).to.deep.equal(correct);
  });

  it('setIsNewProject', () => {
    const value = 'test';
    const correct = {
      type: actions.SET_IS_NEW_PROJECT,
      value,
    };
    expect(functions.setIsNewProject(value)).to.deep.equal(correct);
  });

  it('fetchStatusSuccess', () => {
    const status = 'test';
    const correct = {
      type: actions.FETCH_STATUS_SUCCESS,
      status,
    };
    expect(functions.fetchStatusSuccess(status)).to.deep.equal(correct);
  });

  it('fetchAllStatusData', () => {
    const name = 'test';
    const correct = {
      type: actions.FETCH_PROJECT_STATUS_DATA,
      name,
    };
    expect(functions.fetchAllStatusData(name)).to.deep.equal(correct);
  });

  it('fetchProjects', () => {
    const correct = { type: actions.FETCH_PROJECTS };
    expect(functions.fetchProjects()).to.deep.equal(correct);
  });

  it('fetchRagStatusSuccess', () => {
    const statuses = ['test'];
    const correct = {
      type: actions.FETCH_RAGSTATUS_SUCCESS,
      statuses,
    };
    expect(functions.fetchRagStatusSuccess(statuses)).to.deep.equal(correct);
  });

  it('fetchRagStatusData', () => {
    const name = 'test';
    const correct = {
      type: actions.FETCH_PROJECT_RAGSTATUS_DATA,
      name,
    };
    expect(functions.fetchRagStatusData(name)).to.deep.equal(correct);
  });
});
