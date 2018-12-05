import React, {
  Component,
  PropTypes,
} from 'react';
import { connect } from 'react-redux';
import { fetchAllStatusData, fetchRagStatusData } from 'actions';
import StatusChart from 'components/2-molecules/StatusChart';
import transformStatusData from 'helpers/transformStatusData';
import sortEvents from 'helpers/sortEvents';
import Spinner from 'components/1-atoms/Spinner';
import EventHistory from 'components/2-molecules/EventHistory';

class Status extends Component {
  componentDidMount() {
    const { projectId } = this.props.params;
    this.props.fetchAllStatusData(projectId);
    this.props.fetchRagStatusData(projectId);
  }

  render() {
    if (this.props.xhr) return <Spinner />;

    let component = <div></div>;

    if (!this.props.xhr && this.props.project.name) {
      component = (
        <div className="status">
          <StatusChart
            demandStatus={this.props.demandStatus}
            defectStatus={this.props.defectStatus}
            effortStatus={this.props.effortStatus}
            events={this.props.project.events}
            demandCategories={this.props.demandCategories}
            defectCategories={this.props.defectCategories}
            effortCategories={this.props.effortCategories}
            projection={this.props.projection}
            forecastedCompletionDate={this.props.forecastedCompletionDate}
          />
          <EventHistory events={this.props.events} />
        </div>
    );
    }

    return component;
  }
}

Status.propTypes = {
  fetchAllStatusData: PropTypes.func.isRequired,
  fetchRagStatusData: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  projection: PropTypes.object.isRequired,
  demandStatus: PropTypes.array.isRequired,
  defectStatus: PropTypes.array.isRequired,
  effortStatus: PropTypes.array.isRequired,
  ragStatus: PropTypes.array.isRequired,
  events: PropTypes.array,
  demandCategories: PropTypes.array.isRequired,
  defectCategories: PropTypes.array.isRequired,
  effortCategories: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired,
  xhr: PropTypes.bool,
  forecastedCompletionDate: PropTypes.string,
};

const mapStateToProps = state => {
  const demandStatus = transformStatusData(state.status.demand, 'status');
  const defectStatus = transformStatusData(state.status.defect, 'severity');
  const effortStatus = transformStatusData(state.status.effort, 'activity');
  const ragStatus = state.status.ragStatus;

  const events = sortEvents(state.project.events);

  const demandCategories = state.project.demand.flow ?
    state.project.demand.flow.map(item => (item.name)) : [];
  const defectCategories = state.project.defect.severity ?
    state.project.defect.severity.map(item => (item.name)) : [];
  const effortCategories = state.project.effort.role ?
    state.project.effort.role.map(item => (item.name)) : [];

  let projection = {};
  if (state.project.projection) {
    projection = {
      backlogSize: state.project.projection.backlogSize,
      darkMatter: state.project.projection.darkMatterPercentage,
      iterationLength: state.project.projection.iterationLength,
      periodEnd: state.project.projection.endIterations,
      periodStart: state.project.projection.startIterations,
      startDate: state.project.projection.startDate,
      velocityEnd: state.project.projection.endVelocity,
      velocityMiddle: state.project.projection.targetVelocity,
      velocityStart: state.project.projection.startVelocity,
    };
  }

  return {
    project: state.project,
    demandStatus,
    defectStatus,
    effortStatus,
    ragStatus,
    demandCategories,
    defectCategories,
    effortCategories,
    projection,
    events,
    xhr: state.xhr,
  };
};

export default connect(mapStateToProps, { fetchAllStatusData, fetchRagStatusData })(Status);
