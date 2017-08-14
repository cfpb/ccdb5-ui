import './Hero.less';
import React from 'react';

export default class Hero extends React.Component {
  render() {
    return (
        <header className="content_hero">
          <h1>Consumer Complaint Database</h1>
          <p>
          Consumer complaints get added to this public database after the
          company has responded to the complaint (or after they've had the
          complaint for 15 calendar days, whichever comes first). We only
          publish the description of what happened if the consumer agrees to
          share it and after we take steps to <a>remove personal information</a>.
          Data is generally updated nightly.
          </p>
          <ul className="m-list m-list__horizontal">
            <li className="m-list_item"><a>Database Disclaimers</a> |</li>
            <li className="m-list_item"><a>How we use complaint data</a> |</li>
            <li className="m-list_item"><a>Technical Document</a></li>
          </ul>
        </header>
    );
  }
}
