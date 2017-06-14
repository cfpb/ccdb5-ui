import React from 'react';
import './FilterPanel.less';
import SingleCheckbox from './Filters/SingleCheckbox';
import CollapsibleFilter from './Filters/CollapsibleFilter';

export default class FilterPanel extends React.Component {
  render() {
    return (
      <section className="filter-panel">
        <h3>Filter results by...</h3>
        <SingleCheckbox title="Only show complaints with narratives?"
                        label="Yes" />
        <hr />
        <CollapsibleFilter title="Date CFPB Received the complaint">
            <div className="layout-row">
                <div class="flex-all">
                    <label className="a-label a-label__heading">From:</label>
                    <input type="date" />
                </div>
                <div class="flex-all">
                    <label className="a-label a-label__heading">Through:</label>
                    <input type="date" />
                </div>
            </div>
        </CollapsibleFilter>
        <hr />
        <CollapsibleFilter title="Matched Company Name" 
                           desc="The company name as it appears in our complaint system, which may be different than the name the consumer provided in the complaint">
            <input type="text" placeholder="Enter company name" />
        </CollapsibleFilter>
      </section>
    );
  }
}
