import React from 'react';
import ReactTooltip from 'react-tooltip';
import RAGStatusTableCell from 'components/1-atoms/RAGStatusTableCell';
import RagStatusTable from './RagStatusTable';

const Header = ({ projectName, onLogoClick, status, statuses, location }) => {
  let statusPage = false;
  const pathName = location.pathname.replace(/%20/g, ' ');
  if (pathName === `/${projectName}/status` || pathName === `${projectName}/status`) {
    statusPage = true;
  }
  return (
    <div>
      <div className="header">
        <span className="logo" onClick={onLogoClick}>Synapse</span>
        <span className="project-name">{projectName}</span>
        <span className="rag-status">
          {statusPage ? (
            <div>
              <RAGStatusTableCell
                status={status}
                dataTip
                dataFor={`${projectName}-tooltip`}
              />
              <ReactTooltip
                id={`${projectName}-tooltip`}
                aria-haspopup="true"
              >
                <RagStatusTable
                  projectId={projectName}
                  visibleColumns={[
                    'name',
                    'projected',
                    'actual',
                    'source',
                    'status',
                  ]}
                  statuses={statuses}
                />
              </ReactTooltip>
            </div>
          ) : (
            <span></span>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;

Header.propTypes = {
  projectName: React.PropTypes.string,
  onLogoClick: React.PropTypes.func,
  status: React.PropTypes.string,
  statuses: React.PropTypes.array,
  location: React.PropTypes.object,
};
