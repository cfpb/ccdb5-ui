import React from 'react'
import { connect } from 'react-redux'
import './FilterPanel.less'
import SimpleFilter from './Filters/SimpleFilter'
import CollapsibleFilter from './Filters/CollapsibleFilter'
import FederalState from './Filters/FederalState'
import Issue from './Filters/Issue'
import SingleCheckbox from './Filters/SingleCheckbox'
import ZipCode from './Filters/ZipCode'
import CompanyName from './Filters/CompanyName'
import Product from './Filters/Product'


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
        <CompanyName />
        <hr />
        <Product />
        <hr />
        <Issue />
        <hr />
        <FederalState />
        <hr />
        <ZipCode />
        <hr />
        <SimpleFilter title="Did company provide a timely response?"
                      fieldName="timely"
        />
        <hr />
        <SimpleFilter title="Company Response"
                     desc="How the company responded to the complaint"
                     fieldName="company_response"
        />
        <hr />
        <SimpleFilter title="Company Public Response"
                     desc="The company's optional public-facing response to a consumer's complaint"
                     fieldName="company_public_response"                
        />
        <hr />
        <SimpleFilter title="Did the consumer dispute the response?"
                     fieldName="consumer_disputed"
        />
        <hr />
        <SimpleFilter title="Consumer Consent"
                     desc="Whether a consumer opted to publish their compaint narrative"
                     fieldName="consumer_consent_provided"
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
