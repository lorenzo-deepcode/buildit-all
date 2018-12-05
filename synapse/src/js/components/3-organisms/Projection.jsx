import React, {
  Component,
  PropTypes,
} from 'react';
import { connect } from 'react-redux';
import * as actionCreators from 'actions';
import ProjectionChart from 'components/2-molecules/ProjectionChart';
import ProjectionSlider from 'components/1-atoms/ProjectionSlider';
import ProjectionIntegerInput from 'components/1-atoms/ProjectionIntegerInput';
import Button from 'whippersnapper/build/Button.js';
import Spinner from 'components/1-atoms/Spinner';
import DateInput from 'components/1-atoms/DateInput';
import moment from 'moment';
import makePoints from 'helpers/makePoints';
const defaultProjection = {
  startDate: '1900-01-31',
  iterationLength: 1,
  backlogSize: 1,
  velocityMiddle: 1,
  darkMatter: 1,
  periodStart: 1,
  velocityStart: 1,
  periodEnd: 1,
  velocityEnd: 1,
};

class Projection extends Component {
  componentDidMount() {
    const { projectId } = this.props.params;
    this.props.fetchProjection(projectId);
  }

  render() {
    if (this.props.xhr) return <Spinner />;

    const { projectId } = this.props.params;

    const handleInputChange = (inputValue, key) => {
      const projection = this.props.projection || {};
      const parsedValue = key !== 'startDate' ? parseInt(inputValue, 10) : inputValue;
      projection[key] = parsedValue;
      this.props.updateProjection({
        startDate: projection.startDate,
        iterationLength: projection.iterationLength,
        backlogSize: projection.backlogSize,
        targetVelocity: projection.velocityMiddle,
        darkMatterPercentage: projection.darkMatter,
        startIterations: projection.periodStart,
        startVelocity: projection.velocityStart,
        endIterations: projection.periodEnd,
        endVelocity: projection.velocityEnd,
        endDate: projection.endDate,
      });
    };

    return (
      <div className="projection">
        <div className="container">
          <div className="row">
            <div className="col-md-9">
              <ProjectionChart
                projection={this.props.projection}
                points={this.props.points}
              />
            </div>

            <div className="sliders col-md-3">

              <ProjectionIntegerInput
                label="Backlog"
                unit="stories"
                legendClass="backlog"
                initialValue={this.props.projection.backlogSize}
                onInputChange={value => handleInputChange(value, 'backlogSize')}
              />

              <ProjectionSlider
                label="Dark matter"
                unit="%"
                legendClass="dark-matter"
                initialValue={this.props.projection.darkMatter}
                min={0}
                max={100}
                onInputChange={value => handleInputChange(value, 'darkMatter')}
              />

              <hr />

              <ProjectionIntegerInput
                label="Target velocity"
                unit="stories per iteration"
                initialValue={this.props.projection.velocityMiddle}
                onInputChange={value => handleInputChange(value, 'velocityMiddle')}
              />

              <ProjectionSlider
                label="Iteration length"
                unit="week(s)"
                initialValue={this.props.projection.iterationLength}
                min={1}
                max={8}
                onInputChange={value => handleInputChange(value, 'iterationLength')}
              />

              <hr />

              <ProjectionIntegerInput
                label="Velocity start"
                unit="stories per iteration"
                initialValue={this.props.projection.velocityStart}
                onInputChange={value => handleInputChange(value, 'velocityStart')}
              />

              <ProjectionSlider
                label="Ramp up period"
                unit="iterations"
                initialValue={this.props.projection.periodStart}
                min={0}
                max={30}
                onInputChange={value => handleInputChange(value, 'periodStart')}
              />

              <hr />

              <ProjectionIntegerInput
                label="Velocity end"
                unit="stories per iteration"
                initialValue={this.props.projection.velocityEnd}
                onInputChange={value => handleInputChange(value, 'velocityEnd')}
              />

              <ProjectionSlider
                label="Ramp down period"
                unit="iterations"
                initialValue={this.props.projection.periodEnd}
                min={0}
                max={30}
                onInputChange={value => handleInputChange(value, 'periodEnd')}
              />

              <DateInput
                label="Start date"
                initialValue={this.props.projection.startDate}
                onInputChange={value => handleInputChange(value, 'startDate')}
              />

              <Button
                label="Save"
                cssClasses="button btn btn-primary"
                onClick={() => {
                  const projectionToSave = Object.assign({}, this.props.projection);
                  projectionToSave.endDate = moment(projectionToSave.endDate, 'DD-MMM-YY')
                    .format('YYYY-MM-DD');
                  this.props.saveProjection(projectionToSave, projectId);
                }}
              />

            </div>

          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let projection = defaultProjection;
  if (state.project.projection) {
    projection = {
      startDate: state.project.projection.startDate,
      iterationLength: state.project.projection.iterationLength,
      backlogSize: state.project.projection.backlogSize,
      velocityMiddle: state.project.projection.targetVelocity,
      darkMatter: state.project.projection.darkMatterPercentage,
      periodStart: state.project.projection.startIterations,
      velocityStart: state.project.projection.startVelocity,
      periodEnd: state.project.projection.endIterations,
      velocityEnd: state.project.projection.endVelocity,
    };
  }

  const startDate = moment(projection.startDate, 'YYYY MM DD').format('DD-MMM-YY');
  const points = makePoints(projection, startDate, projection.iterationLength);
  const endDate = points ? points[3].date : undefined;
  projection.endDate = endDate;

  const props = {
    projection,
    points,
    xhr: state.xhr,
  };
  return props;
}

export default connect(mapStateToProps, actionCreators)(Projection);

Projection.propTypes = {
  params: PropTypes.object.isRequired,
  projection: PropTypes.object.isRequired,
  points: PropTypes.array,
  fetchProjection: PropTypes.func.isRequired,
  updateProjection: PropTypes.func.isRequired,
  saveProjection: PropTypes.func.isRequired,
  xhr: PropTypes.bool.isRequired,
};
