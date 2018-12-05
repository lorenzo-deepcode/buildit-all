import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import * as actionCreators from 'actions';
import Input from 'components/1-atoms/Input';
import ProjectDateInput from 'components/1-atoms/ProjectDateInput';
import Button from 'whippersnapper/build/Button.js';
import EditableArrayTable from 'components/2-molecules/EditableArrayTable';
import ValidationTable from 'components/2-molecules/ValidationTable';
import AddFlowItem from 'components/2-molecules/AddFlowItem';
import AddRoleItem from 'components/2-molecules/AddRoleItem';
import AddSeverityItem from 'components/2-molecules/AddSeverityItem';
import api from 'api';

class EditProject extends Component {
  componentWillMount() {
    this.setState({ validation: {} });
    this.props.initializeFormData(this.props.project);
  }

  render() {
    const resetProject = this.props.resetProject;
    const goHome = () => {
      browserHistory.push('/'); // Should this be handled in a redux action?
      resetProject();
    };

    const onInputChange = this.props.onInputChange;
    const project = this.props.project;
    const saveFormData = projectToSave => {
      this.props.saveFormData(projectToSave, '/');
    };
    const validateThisProject = (projectToValidate) => {
      this.setState({ validation: null });
      api.validateProject(projectToValidate)
      .then(validation => {
        this.setState({ validation });
      });
    };
    const onListItemRemove = this.props.onListItemRemove;
    const addItemToDemandFlowList = this.props.addItemToDemandFlowList;
    const addItemToRoleList = this.props.addItemToRoleList;
    const addItemToSeverityList = this.props.addItemToSeverityList;
    const moveListItemUp = this.props.moveListItemUp;
    const moveListItemDown = this.props.moveListItemDown;
    const isNewProject = this.props.isNewProject;
    const updateProject = this.props.updateProject;

    return (
      <div className="edit-project">
        <Button
          label="Save"
          cssClasses="button btn btn-primary"
          id="top-save-button"
          onClick={() => {
            if (isNewProject) {
              saveFormData(project);
            } else {
              updateProject(project);
            }
          }}
        />
        <Button
          label="Cancel"
          cssClasses="button btn btn-secondary"
          onClick={() => {
            goHome();
          }}
        />
        <form>
          <Input
            label="Name"
            section="header"
            property="name"
            onInputChange={onInputChange}
            initialValue={project.name}
          />
          <Input
            label="Program"
            section="header"
            property="program"
            onInputChange={onInputChange}
            initialValue={project.program}
          />
          <Input
            label="Portfolio"
            section="header"
            property="portfolio"
            onInputChange={onInputChange}
            initialValue={project.portfolio}
          />
          <Input
            label="Description"
            section="header"
            property="description"
            onInputChange={onInputChange}
            initialValue={project.description}
          />
          <ProjectDateInput
            label="Start date"
            section="header"
            property="startDate"
            onInputChange={onInputChange}
            initialValue={project.startDate}
          />
          <ProjectDateInput
            label="End date"
            section="header"
            property="endDate"
            onInputChange={onInputChange}
            initialValue={project.endDate}
          />
          <h2>Demand</h2>
          <Input
            label="Demand source"
            section="demand"
            property="source"
            onInputChange={onInputChange}
            initialValue={project.demand.source}
          />
          <Input
            label="Demand source URL"
            section="demand"
            property="url"
            onInputChange={onInputChange}
            initialValue={project.demand.url}
          />
          <Input
            label="Demand project"
            section="demand"
            property="project"
            onInputChange={onInputChange}
            initialValue={project.demand.project}
          />
          <Input
            label="Demand auth policy"
            section="demand"
            property="authPolicy"
            onInputChange={onInputChange}
            initialValue={project.demand.authPolicy}
          />
          <Input
            label="Auth Data"
            section="demand"
            property="userData"
            onInputChange={onInputChange}
            initialValue={project.demand.userData}
          />
          <h3>Demand flow</h3>
          <EditableArrayTable
            items={project.demand.flow}
            removeItem={
              (i) => {
                onListItemRemove('demand', 'flow', i);
              }
            }
            moveItemUp={
              (i) => {
                moveListItemUp('demand', 'flow', i);
              }
            }
            moveItemDown={
              (i) => {
                moveListItemDown('demand', 'flow', i);
              }
            }
          />
          <AddFlowItem
            onAddClick={(name) => {
              addItemToDemandFlowList(name);
            }}
          />

          <h2>Defect</h2>
          <Input
            label="Defect source URL"
            section="defect"
            property="url"
            onInputChange={onInputChange}
            initialValue={project.defect.url}
          />
          <Input
            label="Defect project"
            section="defect"
            property="project"
            onInputChange={onInputChange}
            initialValue={project.defect.project}
          />
          <Input
            label="Defect auth policy"
            section="defect"
            property="authPolicy"
            onInputChange={onInputChange}
            initialValue={project.defect.authPolicy}
          />
          <Input
            label="Auth Data"
            section="defect"
            property="userData"
            onInputChange={onInputChange}
            initialValue={project.defect.userData}
          />
          <Input
            label="Initial Status"
            section="defect"
            property="initialStatus"
            onInputChange={onInputChange}
            initialValue={project.defect.initialStatus}
          />
          <Input
            label="Resolved Status"
            section="defect"
            property="resolvedStatus"
            onInputChange={onInputChange}
            initialValue={project.defect.resolvedStatus}
          />
          <h3>Defect severity</h3>
          <EditableArrayTable
            items={project.defect.severity}
            removeItem={
              (i) => {
                onListItemRemove('defect', 'severity', i);
              }
            }
            moveItemUp={
              (i) => {
                moveListItemUp('defect', 'severity', i);
              }
            }
            moveItemDown={
              (i) => {
                moveListItemDown('defect', 'severity', i);
              }
            }
          />
          <AddSeverityItem
            onAddClick={(name, groupWith) => {
              addItemToSeverityList(name, groupWith);
            }}
          />

          <h2>Effort</h2>
          <Input
            label="Effort source"
            section="effort"
            property="source"
            onInputChange={onInputChange}
            initialValue={project.effort.source}
          />
          <Input
            label="Effort source URL"
            section="effort"
            property="url"
            onInputChange={onInputChange}
            initialValue={project.effort.url}
          />
          <Input
            label="Effort project"
            section="effort"
            property="project"
            onInputChange={onInputChange}
            initialValue={project.effort.project}
          />
          <Input
            label="Effort auth policy"
            section="effort"
            property="authPolicy"
            onInputChange={onInputChange}
            initialValue={project.effort.authPolicy}
          />
          <Input
            label="Auth Data"
            section="effort"
            property="userData"
            onInputChange={onInputChange}
            initialValue={project.effort.userData}
          />
          <h3>Roles</h3>
          <EditableArrayTable
            items={project.effort.role}
            removeItem={
              (i) => {
                onListItemRemove('effort', 'role', i);
              }
            }
            moveItemUp={
              (i) => {
                moveListItemUp('effort', 'role', i);
              }
            }
            moveItemDown={
              (i) => {
                moveListItemDown('effort', 'role', i);
              }
            }
          />
          <AddRoleItem
            onAddClick={(name, groupWith) => {
              addItemToRoleList(name, groupWith);
            }}
          />
        </form>
        <ValidationTable
          validationResult={this.state.validation}
        />
        <Button
          label="Save"
          cssClasses="button btn btn-primary"
          onClick={() => {
            if (isNewProject) {
              saveFormData(project);
            } else {
              updateProject(project);
            }
          }}
        />
        <Button
          label="Validate Project"
          cssClasses="button btn btn-primary"
          onClick={() => {
            validateThisProject(project);
          }}
        />
        <Button
          label="Cancel"
          cssClasses="button btn btn-secondary"
          onClick={(event) => {
            event.preventDefault();
            goHome();
          }}
        />
      </div>
    );
  }
}

EditProject.propTypes = {
  fetchRagStatusData: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  saveFormData: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
  initializeFormData: PropTypes.func.isRequired,
  onListItemRemove: PropTypes.func.isRequired,
  addItemToDemandFlowList: PropTypes.func.isRequired,
  addItemToRoleList: PropTypes.func.isRequired,
  addItemToSeverityList: PropTypes.func.isRequired,
  moveListItemUp: PropTypes.func.isRequired,
  moveListItemDown: PropTypes.func.isRequired,
  updateProject: PropTypes.func.isRequired,
  resetProject: PropTypes.func.isRequired,
  isNewProject: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  project: state.project,
  isNewProject: state.project.new,
  form: state.form,
});


export default connect(mapStateToProps, actionCreators)(EditProject);
