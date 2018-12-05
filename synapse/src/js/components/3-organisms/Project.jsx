import React, {
  Component,
  PropTypes,
} from 'react';
import { connect } from 'react-redux';
import * as actionCreators from 'actions';
import RouteLink from 'components/1-atoms/RouteLink';
import Text from 'whippersnapper/build/Text';
import Spinner from 'components/1-atoms/Spinner';
import Table from 'components/2-molecules/Table';
import formatDate from 'helpers/formatDate';

class Project extends Component {
  componentDidMount() {
    const { projectId } = this.props.params;
    this.props.fetchProject(projectId);
  }

  render() {
    if (this.props.xhr) return <Spinner />;
    const { project, isAuthenticated } = this.props;

    let buttons;
    const hiddenAuthPolicy = (
      <div>
        <Text
          label="Auth policy"
          content="●●●●●●●●"
        />
        <Text
          label="Auth Data"
          content="●●●●●●●●"
        />
      </div>
    );
    let demandAuthPolicy = hiddenAuthPolicy;
    let defectAuthPolicy = hiddenAuthPolicy;
    let effortAuthPolicy = hiddenAuthPolicy;
    if (isAuthenticated) {
      buttons = (
        <div className="buttons">
          <RouteLink
            route={`${project.name}/edit`}
            label="Edit"
            classNames="button-style"
          />
          <RouteLink
            route={`${project.name}/projection`}
            label="Projection"
            classNames="button-style"
          />
          <RouteLink
            route={`${project.name}/status`}
            label="Status"
            classNames="button-style"
          />
        </div>);

      demandAuthPolicy = (
        <div>
          <Text
            label="Auth policy"
            content={project.demand.authPolicy}
          />
          <Text
            label="Auth Data"
            content={project.demand.userData}
          />
        </div>
      );

      defectAuthPolicy = (
        <div>
          <Text
            label="Auth policy"
            content={project.defect.authPolicy}
          />
          <Text
            label="Auth Data"
            content={project.defect.userData}
          />
        </div>
      );
      effortAuthPolicy = (
        <div>
          <Text
            label="Auth policy"
            content={project.effort.authPolicy}
          />
          <Text
            label="Auth Data"
            content={project.effort.userData}
          />
        </div>
      );
    }

    return (
      <div className="project">
        {buttons}
        <div className="main">
          <Text label="Name" content={project.name} />
          <Text label="Description" content={project.description} />
          <Text label="Portfolio" content={project.portfolio} />
          <Text label="Program" content={project.program} />
          <Text label="Start date" content={formatDate(project.startDate)} />
          <Text label="End date" content={formatDate(project.endDate)} />

          <div className="subsection">
            <h2>Demand</h2>
            <Text
              label="Source"
              content={project.demand.source}
            />
            <Text
              label="Source URL"
              content={project.demand.url}
            />
            <Text
              label="Project"
              content={project.demand.project}
            />
            <h3>Auth</h3>
            {demandAuthPolicy}

            <h3>Flow</h3>
            <Table
              tableData={project.demand.flow}
              visibleColumns={['name']}
              rowKey="name"
            />
          </div>

          <div className="subsection">
            <h2>Defect</h2>
            <Text
              label="Source"
              content={project.defect.source}
            />
            <Text
              label="Source URL"
              content={project.defect.url}
            />
            <Text
              label="Project"
              content={project.defect.project}
            />
            <Text
              label="Initial Status"
              content={project.defect.initialStatus}
            />
            <Text
              label="Resolved Status"
              content={project.defect.resolvedStatus}
            />
            <h3>Auth</h3>
            {defectAuthPolicy}

            <h3>Severity</h3>
            <Table
              tableData={project.defect.severity}
              visibleColumns={['name', 'groupWith']}
              rowKey="name"
            />
          </div>

          <div className="subsection">
            <h2>Effort</h2>
            <Text
              label="Source"
              content={project.effort.source}
            />
            <Text
              label="Source URL"
              content={project.effort.url}
            />
            <Text
              label="Project"
              content={project.effort.project}
            />
            <h3>Auth</h3>
            {effortAuthPolicy}

            <h3>Roles</h3>
            <Table
              tableData={project.effort.role}
              visibleColumns={['name', 'groupWith']}
              rowKey="name"
            />
          </div>
        </div>
      </div>
    );
  }
}

Project.propTypes = {
  project: PropTypes.object.isRequired,
  setIsNewProject: PropTypes.func.isRequired,
  fetchProject: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  xhr: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  project: state.project,
  xhr: state.xhr,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, actionCreators)(Project);
