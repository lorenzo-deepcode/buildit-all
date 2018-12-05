import { project as reducer, initialState } from 'reducers/project';
import {
  initializeFormData,
  onInputChange,
  updateProjection,
  fetchProjectSuccess,
  resetProject,
} from 'actions';

import { expect } from 'chai';

describe('project reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).to.equal(initialState);
  });

  it('should update the projection', () => {
    const newProjection = {};
    const action = updateProjection(newProjection);
    const finalState = Object.assign({}, initialState);
    finalState.projection = newProjection;

    expect(reducer(undefined, action)).to.deep.equal(finalState);
  });

  it('should update a whole project', () => {
    const newProject = { name: 'foo', projection: {} };
    const action = fetchProjectSuccess(newProject);

    expect(reducer(undefined, action)).to.deep.equal(newProject);
  });

  it('should update a whole project when it\'s not new', () => {
    const newProject = { name: 'foo', projection: {}, new: false };
    const action = fetchProjectSuccess(newProject);

    expect(reducer(undefined, action)).to.deep.equal(newProject);
  });

  it('should reset a project', () => {
    const oldProject = { name: 'foo' };
    const action = resetProject();

    expect(reducer(oldProject, action)).to.deep.equal(initialState);
  });

  const originalUpdateState = { id: 'foo', demand: {}, defect: {}, effort: {} };
  it('should update the form header', () => {
    const headerKey = 'headerKey';
    const headerValue = 'headerValue';
    const action = onInputChange('header', headerKey, headerValue);

    const correct = Object.assign({}, originalUpdateState, { headerKey: headerValue });
    const actual = reducer(originalUpdateState, action);
    expect(actual).to.deep.equal(correct);
  });
  it('should update the form demand values', () => {
    const demandKey = 'demandKey';
    const demandValue = 'demandValue';
    const action = onInputChange('demand', demandKey, demandValue);
    const correct = originalUpdateState;
    correct.demand[demandKey] = demandValue;
    const actual = reducer(originalUpdateState, action);
    expect(actual).to.deep.equal(correct);
  });
  it('should update the form defect values', () => {
    const defectKey = 'defectKey';
    const defectValue = 'defectValue';
    const action = onInputChange('defect', defectKey, defectValue);
    const correct = originalUpdateState;
    correct.defect[defectKey] = defectValue;
    const actual = reducer(originalUpdateState, action);
    expect(actual).to.deep.equal(correct);
  });
  it('should update the form effort values', () => {
    const effortKey = 'effortKey';
    const effortValue = 'effortValue';
    const action = onInputChange('effort', effortKey, effortValue);
    const correct = originalUpdateState;
    correct.effort[effortKey] = effortValue;
    const actual = reducer(originalUpdateState, action);
    expect(actual).to.deep.equal(correct);
  });
  it('should not update the form header on bad data', () => {
    const discardKey = 'discardKey';
    const discardValue = 'discardValue';
    const action = onInputChange('discard', discardKey, discardValue);

    const actual = reducer(originalUpdateState, action);
    expect(actual).to.deep.equal(originalUpdateState);
  });

  it('should initialize a form', () => {
    const initialized = { name: 'foo' };
    const action = initializeFormData(initialized);

    expect(reducer({}, action)).to.deep.equal(initialized);
  });

  it('should remove a list item', () => {
    const original = [1, 2, 3, 4, 5];
    const correct = [1, 2, 4, 5];
    const section = 'demand';
    const list = 'flow';
    const action = {
      type: 'REMOVE_LIST_ITEM',
      section,
      list,
      index: 2,
    };
    const state = { demand: { flow: original } };
    const correctState = { demand: { flow: correct } };

    expect(reducer(state, action)).to.deep.equal(correctState);
  });

  it('should move a list item up', () => {
    const original = [1, 2, 3, 4, 5];
    const correct = [1, 3, 2, 4, 5];
    const section = 'demand';
    const list = 'flow';
    const action = {
      type: 'MOVE_LIST_ITEM_UP',
      section,
      list,
      index: 2,
    };
    const state = { demand: { flow: original } };
    const correctState = { demand: { flow: correct } };

    const actual = reducer(state, action);
    expect(actual).to.deep.equal(correctState);
  });
  it('should move a list item down', () => {
    const original = [1, 2, 3, 4, 5];
    const correct = [1, 2, 3, 5, 4];
    const section = 'demand';
    const list = 'flow';
    const action = {
      type: 'MOVE_LIST_ITEM_DOWN',
      section,
      list,
      index: 3,
    };
    const state = { demand: { flow: original } };
    const correctState = { demand: { flow: correct } };

    const actual = reducer(state, action);
    expect(actual).to.deep.equal(correctState);
  });
  it('won\'t move a bad list item index', () => {
    const action = {
      type: 'MOVE_LIST_ITEM_DOWN',
      section: 'demand',
      list: 'flow',
      index: 100,
    };
    const state = { demand: { flow: [1, 2, 3, 4, 5] } };
    expect(reducer(state, action)).to.deep.equal(state);
  });

  it('should add a demand flow item', () => {
    const newProject = { demand: { flow: [] } };
    const name = 'foo';
    const action = {
      type: 'ADD_DEMAND_FLOW_LIST_ITEM',
      name,
    };
    const correct = { demand: { flow: [{ name }] } };
    expect(reducer(newProject, action)).to.deep.equal(correct);
  });

  it('should add a defect flow item', () => {
    const newProject = { defect: { flow: [] } };
    const name = 'foo';
    const action = {
      type: 'ADD_DEFECT_FLOW_LIST_ITEM',
      name,
    };
    const correct = { defect: { flow: [{ name }] } };
    expect(reducer(newProject, action)).to.deep.equal(correct);
  });

  it('should add a role item', () => {
    const newProject = { effort: { role: [] } };
    const name = 'foo';
    const groupWith = 'bar';
    const action = {
      type: 'ADD_ROLE_LIST_ITEM',
      name,
      groupWith,
    };
    const correct = {
      effort: {
        role: [{ name, groupWith }],
      },
    };
    expect(reducer(newProject, action)).to.deep.equal(correct);
  });

  it('should add a severity item', () => {
    const newProject = { defect: { severity: [] } };
    const name = 'foo';
    const groupWith = 'bar';
    const action = {
      type: 'ADD_SEVERITY_LIST_ITEM',
      name,
      groupWith,
    };
    const correct = {
      defect: {
        severity: [{ name, groupWith }],
      },
    };
    expect(reducer(newProject, action)).to.deep.equal(correct);
  });
});
