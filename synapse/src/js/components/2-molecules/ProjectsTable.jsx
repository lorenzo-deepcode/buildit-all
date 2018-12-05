import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import RouteLink from 'components/1-atoms/RouteLink';
import TableCell from 'components/1-atoms/TableCell';
import RagStatusTable from './RagStatusTable';
import RAGStatusTableCell from 'components/1-atoms/RAGStatusTableCell';

class ProjectsTable extends Component {
  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  render() {
    const headerRow = [];
    const bodyRows = [];

    for (const headerValue of this.props.visibleColumns) {
      // Hide description on small screens
      const classes =
        (headerValue === 'description') ? `${headerValue} hidden-sm hidden-xs` : headerValue;

      headerRow.push(
        <th
          className={`projectsHeader tableHeaderCell ${classes}`}
          key={headerValue}
          id={headerValue}
          onClick={() => { this.props.sortProjects(headerValue); }}
        >{headerValue}
         {this.props.sortedColumn === headerValue && !this.props.sortAscending &&
           <i className="fa fa-long-arrow-down" aria-hidden="true"></i>}
         {this.props.sortedColumn === headerValue && this.props.sortAscending &&
           <i className="fa fa-long-arrow-up" aria-hidden="true"></i>}
        </th>);
    }

    const tooltips = [];

    for (let i = 0; i < this.props.tableData.length; i++) {
      const projectId = this.props.tableData[i][this.props.rowKey];
      const bodyRow = [];

      for (const key of this.props.visibleColumns) {
        const cellValue = this.props.tableData[i][key];
        // Hide description on small screens
        const classes = (key === 'description') ? `${key} hidden-sm hidden-xs` : key;

        if (key === 'status') {
          bodyRow.push(
            <RAGStatusTableCell
              key={i + key}
              status={cellValue}
              dataTip
              dataFor={`${projectId}-tooltip`}
            />
          );
          tooltips.push(
            <ReactTooltip
              id={`${projectId}-tooltip`}
              key={`${i} ${key} tooltip`}
              aria-haspopup="true"
            >
              <RagStatusTable
                key={projectId}
                visibleColumns={[
                  'name',
                  'projected',
                  'actual',
                  'source',
                  'status',
                ]}
                statuses={this.props.statuses}
              />
            </ReactTooltip>
          );
        } else {
          bodyRow.push(<TableCell key={i + key} cellValue={cellValue} classes={classes} />);
        }
      }

      bodyRow.push(
        <td key={`view-${projectId}`}>
          <RouteLink
            route={`${projectId}`}
            label="View"
          />
        </td>
      );

      bodyRow.push(
        <td key={`projection-${projectId}`}>
          <RouteLink
            route={`${projectId}/projection`}
            label="Projection"
          />
        </td>
      );

      bodyRow.push(
        <td key={`status-${projectId}`}>
          <RouteLink
            route={`${projectId}/status`}
            label="Status"
          />
        </td>
      );

      if (this.props.isAuthenticated) {
        bodyRow.push(
          <td
            key={`delete-${projectId}`}
            onClick={() => this.props.deleteProject(projectId)}
          >
            <span
              className="delete-project-control fa fa-trash"
              data-project={`${projectId}`}
            ></span>
          </td>
        );
      }

      bodyRows.push(<tr
        id={this.props.tableData[i][this.props.rowKey]}
        key={this.props.tableData[i][this.props.rowKey]}
        className="tableBodyRow"
        onMouseEnter={() => this.props.fetchRagStatusData(projectId)}
      >{bodyRow}</tr>);
    }
    return (
      <div>
        <table className="table projectsTable">
          <thead>
            <tr className="tableHeaderRow">
              {headerRow}
            </tr>
          </thead>
          <tbody>
            {bodyRows}
          </tbody>
        </table>
        {tooltips}
      </div>
    );
  }
}

export default ProjectsTable;

ProjectsTable.propTypes = {
  tableData: React.PropTypes.array.isRequired,
  visibleColumns: React.PropTypes.array.isRequired,
  rowKey: React.PropTypes.string.isRequired,
  deleteProject: React.PropTypes.func.isRequired,
  isAuthenticated: React.PropTypes.bool.isRequired,
  statuses: React.PropTypes.array,
  sortProjects: React.PropTypes.func.isRequired,
  sortedColumn: React.PropTypes.string,
  sortAscending: React.PropTypes.bool,
  fetchRagStatusData: React.PropTypes.func.isRequired,
};
