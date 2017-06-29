import React from 'react';
import Pill from './Pill';
import './PillPanel.less';

export const PillPanel = ({ filters }) => {
  if( !filters ) {
    return null
  }

  return (
    <section className="pill-panel">    
      <h5 className="pill-label flex-fixed">Filters Applied:</h5>
      <ul className="layout-row">
        { Object.keys(filters).map(x => {
          return (
            <Pill key={x} fieldName={x} value={filters[x]} />
          )
        })}
        <li className="clear-all">
          <button className="a-btn a-btn__link body-copy" onClick={ (0) }>
            Clear all filters
          </button>
        </li>
      </ul>
    </section>
  );
}

export default PillPanel;
