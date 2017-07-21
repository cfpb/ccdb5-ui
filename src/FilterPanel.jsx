import React from 'react'
import { connect } from 'react-redux'
import './FilterPanel.less'
import Aggregation from './Filters/Aggregation'
import CollapsibleFilter from './Filters/CollapsibleFilter'
import FederalState from './Filters/FederalState'
import Issue from './Filters/Issue'
import SingleCheckbox from './Filters/SingleCheckbox'
import ZipCode from './Filters/ZipCode'


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
                     fieldName="product"
        />
        <hr />
        <Issue />
        <hr />
        <FederalState />
        <hr />
        <ZipCode />
        <hr />
        <Aggregation title="Did company provide a timely response?"
                     fieldName="timely"
                     showChildren={false}
        />
        <hr />
        <Aggregation title="Company Response"
                     desc="How the company responded to the complaint"
                     fieldName="company_response"
                     showChildren={false}
        />
        <hr />
        <Aggregation title="Company Public Response"
                     desc="The company's optional public-facing response to a consumer's complaint"
                     fieldName="company_public_response"
                     showChildren={false}                     
        />
        <hr />
        <Aggregation title="Did the consumer dispute the response?"
                     fieldName="consumer_disputed"
                     showChildren={false}
        />
        <hr />
        <Aggregation title="Consumer Consent"
                     desc="Whether a consumer opted to publish their compaint narrative"
                     fieldName="consumer_consent_provided"
                     showChildren={false}
        />
      </section>
    )
  }
}

const mapStateToProps = state => {
  return {
    aggs: state.aggs
  }
}

export default connect(mapStateToProps)(FilterPanel)
