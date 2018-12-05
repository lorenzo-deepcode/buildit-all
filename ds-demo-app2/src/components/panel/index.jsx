import React from 'react';
import moment from 'moment';
import './style.less';

class Panel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="appPanel">
        <div className="mainContent">
          <div className="row">
            <label for="account">Account number</label>
            <input id="account"></input>
          </div>
          <div className="row">
            <label for="sort">Sort code</label>
            <input id="sort"></input>
          </div>
          <div className="row">
            <label for="amount">Amount</label>
            <input id="amount"></input>
          </div>
          <button>Pay now</button>
        </div>
        <div className="sidebar">
          <button>My accounts</button>
        </div>
      </div>
    )
  }
}

export default Panel;
