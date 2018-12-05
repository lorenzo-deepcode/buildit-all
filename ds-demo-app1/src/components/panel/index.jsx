import React from 'react';
import moment from 'moment';
import { Button } from '@buildit/ds-demo-lib';
import './style.less';

function generateData(data) {
  let amount = 1000;
  let d = moment();

  for (let i = 0; i < 50; i++) {
    data[i] = [ d.subtract(1, 'days').format('D/M/Y'), '£ 0.00', '£ 0.00' ];
  }

  return data;
}

class Panel extends React.Component {
  constructor(props) {
    super(props);

    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);

    this.state = {
      data: generateData([]),
      page: 0
    }
  }

  nextPage() {
    if (this.state.page < 4) {
      this.setState({
        page: ++this.state.page
      })
    }
  }

  previousPage() {
    if (this.state.page > 0) {
      this.setState({
        page: --this.state.page
      })
    }
  }

  render() {
    const p = this.state.page * 10;
    const table = this.state.data && (this.state.data.slice(p, p + 10)).map(item => (
        <tr>
          <td>{item[0]}</td>
          <td className="financialValue">{item[1]}</td>
          <td className="financialValue">{item[2]}</td>
        </tr>
      ));

    return (
      <main className="appPanel">
        <div className="mainContent">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {table}
            </tbody>
          </table>
        </div>
        <div className="sidebar">
          <Button onClick={this.previousPage}>Previous</Button>
          <Button onClick={this.nextPage}>Next</Button>
        </div>
      </main>
    )
  }
}

export default Panel;
