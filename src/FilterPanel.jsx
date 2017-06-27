import React from 'react';
import { connect } from 'react-redux'
import './FilterPanel.less';
import Aggregation from './Filters/Aggregation';
import CollapsibleFilter from './Filters/CollapsibleFilter';
import SingleCheckbox from './Filters/SingleCheckbox';

export class FilterPanel extends React.Component {
  render() {
    return (
      <section className="filter-panel">
        <h3>Filter results by...</h3>
        <SingleCheckbox title="Only show complaints with narratives?"
                        label="Yes" />
        <hr />
        <CollapsibleFilter title="Date CFPB Received the complaint">
            <div className="layout-row">
                <div className="flex-all">
                    <label className="a-label a-label__heading">From:</label>
                    <input type="date" />
                </div>
                <div className="flex-all">
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
        <hr />
        <Aggregation title="Did company provide a timely response?"
                         options={this.props.aggs.timely_response}
                         fieldName="timely_response"
        />
        <hr />
        <Aggregation title="Company Response"
                         desc="How the company responded to the complaint"
                         options={this.props.aggs.company_response}
                         fieldName="company_response"
        />
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    aggs: state.aggs
  }
}

export default connect(mapStateToProps)(FilterPanel)
