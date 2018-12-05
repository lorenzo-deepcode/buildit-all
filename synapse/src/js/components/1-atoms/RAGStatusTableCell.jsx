import React from 'react';

const RAGStatusTableCell = ({ status, id, dataFor }) => {
  let ragClass = 'blank';
  if (status) {
    ragClass = status;
  }
  return (
    <td className="rag-status-cell" id={id} data-tip data-for={dataFor}>
      <span className={`indicator ${ragClass}`}></span>
    </td>
  );
};

export default RAGStatusTableCell;

RAGStatusTableCell.propTypes = {
  status: React.PropTypes.string,
  id: React.PropTypes.string,
  dataFor: React.PropTypes.string,
};
