import React, { Component } from 'react';
import renderStatusChart from './renderStatusChart';

class StatusChart extends Component {
  constructor(props) {
    super(props);
    this.chartContainer = null;
  }

  componentDidMount() {
    renderStatusChart(this.props, this.chartContainer);
  }

  render() {
    return (
      <div className="status-chart">
        <div
          className="chart-container"
          ref={element => { this.chartContainer = element; return false; }}
        />
      </div>
    );
  }
}

export default StatusChart;

StatusChart.propTypes = {
  demandStatus: React.PropTypes.array.isRequired,
  defectStatus: React.PropTypes.array.isRequired,
  effortStatus: React.PropTypes.array.isRequired,
  demandCategories: React.PropTypes.array.isRequired,
  defectCategories: React.PropTypes.array.isRequired,
  effortCategories: React.PropTypes.array.isRequired,
  projection: React.PropTypes.object,
};
