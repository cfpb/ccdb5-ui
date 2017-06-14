import React from 'react';
import './FilterPanel.less';
import SingleCheckbox from './Filters/SingleCheckbox';

export default class FilterPanel extends React.Component {
  render() {
    return (
      <section className="filter-panel">
        <h3>Filter results by...</h3>
        <SingleCheckbox title="Only show complaints with narratives?"
                        label="Yes" />
        <hr />
      </section>
    );
  }
}
