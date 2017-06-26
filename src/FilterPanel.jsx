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
        <Aggregation title="Product / sub-product"
                     desc="The type of product and sub-product the consumer identified in the complaint"
                     options={this.props.aggs.product}
        />
        <hr />
        <Aggregation title="Issue / sub-issue"
                     desc="The type of issue and sub-issue the consumer identified in the complaint"
                     options={this.props.aggs.issue}
        />
        <hr />
        <CollapsibleFilter title="State"
                           desc="The state of the mailing address provided by the consumer">
            <input type="text" placeholder="Enter state name or abbreviation" />
        </CollapsibleFilter>
        <hr />
        <CollapsibleFilter title="Zip Code"
                           desc="The mailing ZIP code provided by the consumer">
            <input type="text" placeholder="Enter first three digits of zip code" />
        </CollapsibleFilter>
        <hr />
        <Aggregation title="Did company provide a timely response?"
                         options={this.props.aggs.timely}
        />
        <hr />
        <Aggregation title="Company Response"
                         desc="How the company responded to the complaint"
                         options={this.props.aggs.company_response}
        />
        <hr />
        <Aggregation title="Company Public Response"
                         desc="The company's optional public-facing response to a consumer's complaint"
                         options={this.props.aggs.company_public_response}
        />
        <hr />
        <Aggregation title="Did the consumer dispute the response?"
                     options={this.props.aggs.consumer_disputed}
        />
        <hr />
        <Aggregation title="Consumer Consent"
                     desc="Whether a consumer opted to publish their compaint narrative"
                     options={this.props.aggs.consumer_consent_provided}
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