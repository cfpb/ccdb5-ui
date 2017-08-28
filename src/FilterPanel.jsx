import './FilterPanel.less'
import CompanyName from './Filters/CompanyName'
import { connect } from 'react-redux'
import DateFilter from './Filters/DateFilter'
import FederalState from './Filters/FederalState'
import Issue from './Filters/Issue'
import Product from './Filters/Product'
import React from 'react'
import SimpleFilter from './Filters/SimpleFilter'
import SingleCheckbox from './Filters/SingleCheckbox'
import ZipCode from './Filters/ZipCode'

export class FilterPanel extends React.Component {
  render() {
    const descPublicResponse = "The company's optional public-facing " +
      "response to a consumer's complaint"
    const descConsumerConsent = 'Whether a consumer opted to publish their ' +
      'compaint narrative'

    return (
      <section className="filter-panel">
        <h3>Filter results by...</h3>
        <SingleCheckbox title="Only show complaints with narratives?"
                        fieldName="has_narrative" />
        <hr />
        <DateFilter fieldName="date_received"
                    title="Date CFPB Received the complaint" />
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
                     desc={descPublicResponse}
                     fieldName="company_public_response"
        />
        <hr />
        <DateFilter title="Date complaint sent to company"
                    fieldName="company_received"
        />
        <hr />
        <SimpleFilter title="Consumer Consent"
                     desc={descConsumerConsent}
                     fieldName="consumer_consent_provided"
        />
        <hr />
        <SimpleFilter title="How did the consumer submit the complaint to the CFPB?"
                     fieldName="submitted_via"
        />
      </section>
    )
  }
}

const mapStateToProps = state => ( {
  aggs: state.aggs
} )

export default connect( mapStateToProps )( FilterPanel )
