import PropTypes from 'prop-types'
import React from 'react';
import { FormattedDate } from 'react-intl';
import './ComplaintDetail.less';

const ERROR = 'ERROR'
const WAITING = 'WAITING'
const RESULTS = 'RESULTS'

export default class ComplaintDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      phase: WAITING
    }

    // Render/Phase Map
    this.renderMap = {
      ERROR: this._renderError.bind(this),
      WAITING: this._renderWaiting.bind(this),
      RESULTS: this._renderResults.bind(this),
    }

    // Binds
    this._processError = this._processError.bind(this)
    this._processResults = this._processResults.bind(this)
  }

  // --------------------------------------------------------------------------
  // Interfacing with the API

  _callAPI(id) {
    const uri = '@@API' + id
    fetch(uri)
      .then(result => result.json())
      .then(data => this._processResults(data))
      .catch(error => this._processError(error))
  }

  _processError(error) {
    this.setState({phase: ERROR})
  }

  _processResults(data) {
    this.setState({
      phase: RESULTS,
      row: data.hits.hits[0]._source
    })
  }

  // --------------------------------------------------------------------------
  // React Methods

  componentDidMount() {
    this._callAPI(this.props.complaint_id)
  }

  render() {
    return (
      <section className="card-container">
        <nav className="layout-row">
          <div className="back-to-search">
            <button className="a-btn a-btn__link"
                    onClick={this.props.onClickedBack}>
                <span className="cf-icon cf-icon-left"></span>
                Back to search results
            </button>          
          </div>
          <div className="meaning">
            <a href="https://www.consumerfinance.gov/complaint/data-use/"
               target="_blank">
              What do all these data points mean?
            </a>
          </div>
        </nav>
        { this.renderMap[this.state.phase]() }
      </section>
    )
  }

  // --------------------------------------------------------------------------
  // Subrender Methods

  _renderConsumerConsent(value) {
    const iconMap = {
      'Consent provided': 'cf-icon-approved-round',
      'Consent not provided': 'cf-icon-delete-round',
      'Consent withdrawn': 'cf-icon-minus-round',
      'N/A': 'cf-icon-help-round',
    }

    let styles = ['cf-icon', 'cf-icon__before']
    if (value in iconMap) {
      styles.push(iconMap[value])
    }
    else {
      styles.push('cf-icon-error-round')
    }

    return (
      <div>
        <span className={styles.join(' ')}></span>
        <span className="body-copy">{ value }</span>
      </div>
    )
  }

  _renderError() {
    return (
       <h1>There was a problem retrieving { this.props.complaint_id }</h1>
    )
  }

  _renderResults() {
    const row = this.state.row

    // Process the narrative
    let narrative = row.complaint_what_happened || ""

    return (
      <article>
        <h1>{ this.props.complaint_id }</h1>
        <div className="card">
          <div className="card-left layout-column">
            <h5>Date CFPB received the complaint</h5>
            <span className="body-copy">
              <FormattedDate value={ row.date_received } />
            </span>
            <br />
            <h5>Consumer's state</h5>
            <span className="body-copy">{ row.state }</span>
            <br />
            <h5>Consumer's zip</h5>
            <span className="body-copy">{ row.zip_code }</span>
            <br />
            <h5>Complaint submitted via</h5>
            <span className="body-copy">{ row.submitted_via }</span>
            <br />
            <h5>Tags</h5>
            <span className="body-copy">{ row.tags }</span>
            <br />
            <h5>Did consumer dispute the response?</h5>
            <span className="body-copy">{ row.consumer_disputed }</span>
          </div>
          <div className="card-right layout-column">
            <h5>Product</h5> 
            <h3>{ row.product }</h3>
            { row.sub_product ? (
              <div className="layout-row">
                <span className="body-copy subitem">Sub-product:</span>
                <span className="body-copy">{ row.sub_product }</span>
              </div>
              ) : null
            }
            <br />
            <h5>Issue</h5>
            <h3>{ row.issue }</h3>
            { row.sub_issue ? (
              <div className="layout-row">
                <span className="body-copy subitem">Sub-issue:</span>
                <span className="body-copy">{ row.sub_issue }</span>
              </div>
              ) : null
            }
            <br />
            <h5>Consumer consent to publish narrative</h5>
            { this._renderConsumerConsent(row.consumer_consent_provided) }
            <br />            
            { narrative ? (
              <div>
                <h5>Consumer Complaint Narrative</h5>
                <span className="body-copy">
                  { narrative }
                </span>
              </div>
              ) : null
            }
          </div>
        </div>

        <h3 className="company-information">Company Information</h3>
        <div className="card">
          <div className="card-left layout-column">
            <h5>Date complaint sent to company</h5>
            <span className="body-copy">
              <FormattedDate value={ row.date_sent_to_company } />
            </span>
            <br />
            <h5>Matched company name</h5>
            <span className="body-copy">{ row.company }</span>
            <br />
          </div>
          <div className="card-right layout-column">
            <h5>Timely response?</h5>
            <span className="body-copy">{ row.timely }</span>
            <br />
            <h5>Company response to consumer</h5>
            <span className="body-copy">{ row.company_response }</span>
            <br />
            <h5>Company public response</h5>
            <span className="body-copy">{ row.company_public_response }</span>
          </div>
        </div>
      </article>
    )
  }

  _renderWaiting() {
    return (
      <div className="waiting">
        <h1>Loading { this.props.complaint_id }...</h1>
      </div>
    )
  }

}

// ----------------------------------------------------------------------------
// Meta

ComplaintDetail.propTypes = {
  complaint_id: PropTypes.string.isRequired,
  onClickedBack: PropTypes.func
}

ComplaintDetail.defaultProps = {
  onClickedBack: () => history.go(-1)
}
