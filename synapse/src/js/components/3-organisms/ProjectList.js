import React, {
  Component,
  PropTypes,
} from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { fetchProjects, deleteProject } from 'actions/projects';
import { fetchRagStatusData } from 'actions';
import Button from 'whippersnapper/build/Button.js';
import Spinner from 'components/1-atoms/Spinner';
import ProjectsTable from 'components/2-molecules/ProjectsTable';

class ProjectList extends Component {
  constructor(props) {
    super(props);
    this.onSort = this.onSort.bind(this);
    this.state = {
      sortedColumn: '',
      sortAscending: true,
    };
  }

  componentDidMount() {
    this.props.fetchProjects();
  }

  onSort(sortBy) {
    let newSort = false;
    if (this.state.sortedColumn !== sortBy) {
      newSort = true;
    }
    this.props.projectList.sort((a, b) => {
      const aValue = a[sortBy] || 'undefined';
      const bValue = b[sortBy] || 'undefined';
      if (this.state.sortAscending || newSort) {
        return aValue.localeCompare(bValue);
      }
      return -aValue.localeCompare(bValue);
    });
    if (!newSort) {
      this.setState({
        sortAscending: !this.state.sortAscending,
      });
    }
    if (newSort) {
      this.setState({
        sortedColumn: sortBy,
        sortAscending: false,
      });
    }
  }

  render() {
    const { xhr, isAuthenticated } = this.props;
    let newButton;
    if (isAuthenticated) {
      newButton = (
        <Button
          label="New"
          cssClasses="normal"
          onClick={() => {
            browserHistory.push('/new');
          }}
        />);
    }

    if (xhr) return <Spinner />;
    return (
      <div className="project-list">
        {newButton}
        <div className="main">
          <ProjectsTable
            tableData={this.props.projectList || []}
            visibleColumns={[
              'name',
              'portfolio',
              'program',
              'status',
              'description',
            ]}
            rowKey={'name'}
            deleteProject={this.props.deleteProject}
            isAuthenticated={isAuthenticated}
            statuses={this.props.statuses}
            sortProjects={this.onSort}
            sortedColumn={this.state.sortedColumn}
            sortAscending={this.state.sortAscending}
            fetchRagStatusData={this.props.fetchRagStatusData}
          />
        </div>
      </div>
    );
  }
}

ProjectList.propTypes = {
  fetchProjects: PropTypes.func,
  fetchProject: PropTypes.func,
  deleteProject: PropTypes.func,
  projectList: PropTypes.array,
  xhr: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  statuses: PropTypes.array,
  fetchRagStatusData: PropTypes.func,
};

const mapStateToProps = state => ({
  projectList: state.projects.projectList,
  xhr: state.xhr,
  isAuthenticated: state.auth.isAuthenticated,
  statuses: state.statuses.statuses,
});

export default connect(mapStateToProps, {
  fetchProjects,
  deleteProject,
  fetchRagStatusData,
})(ProjectList);
