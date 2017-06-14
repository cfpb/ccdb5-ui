import React from 'react';
import './ActionBar.less';

export default class ActionBar extends React.Component {
  render() {
    return (
        <summary className="action-bar">
          <div><h2>Showing x of y complaints</h2></div>
          <div>Page | Sort | Export</div>
        </summary>
    );
  }
}
