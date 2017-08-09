import './ComplaintDetail.less';
import { connect } from 'react-redux'
import { FormattedDate } from 'react-intl';
import { getComplaintDetail } from './actions/complaints'
import PropTypes from 'prop-types'
import React from 'react';

const ERROR = 'ERROR'
const WAITING = 'WAITING'
const RESULTS = 'RESULTS'

export class ComplaintDetail extends React.Component {
  constructor( props ) {
    super( props )

    // Render/Phase Map
    this.renderMap = {
      ERROR: this._renderError.bind( this ),
      WAITING: this._renderWaiting.bind( this ),
      RESULTS: this._renderResults.bind( this )
    }
  }

  // --------------------------------------------------------------------------
  // React Methods

  componentDidMount() {
    this.props.loadDetail( this.props.complaint_id )
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
        { this.renderMap[this.props.phase]() }
      </section>
    )
  }

  // --------------------------------------------------------------------------
  // Subrender Methods

  _renderCompanyTimely( value ) {
    const styles = [ 'cf-icon', 'cf-icon__before', 'cf-icon-clock-round' ]
    if ( value.toLowerCase() === 'no' ) {
      styles.push( 'not-timely' )
    }

    return (
      <div>
        <span className={styles.join( ' ' )}></span>
        <span className="body-copy">{ value }</span>
      </div>
    )
  }

  _renderConsumerConsent( value ) {
    const iconMap = {
      'Consent provided': 'cf-icon-approved-round',
      'Consent not provided': 'cf-icon-delete-round',
      'Consent withdrawn': 'cf-icon-minus-round',
      'N/A': 'cf-icon-help-round'
    }

    const styles = [ 'cf-icon', 'cf-icon__before' ]
    if ( value in iconMap ) {
      styles.push( iconMap[value] )
    } else {
      styles.push( 'cf-icon-error-round' )
    }

    return (
      <div>
        <span className={styles.join( ' ' )}></span>
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
    const row = this.props.row

    // Process the narrative
    const narrative = row.complaint_what_happened || ''

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
            { row.sub_product ?
              <div className="layout-row">
                <span className="body-copy subitem">Sub-product:</span>
                <span className="body-copy">{ row.sub_product }</span>
              </div> :
               null
            }
            <br />
            <h5>Issue</h5>
            <h3>{ row.issue }</h3>
            { row.sub_issue ?
              <div className="layout-row">
                <span className="body-copy subitem">Sub-issue:</span>
                <span className="body-copy">{ row.sub_issue }</span>
              </div> :
               null
            }
            <br />
            <h5>Consumer consent to publish narrative</h5>
            { this._renderConsumerConsent( row.consumer_consent_provided ) }
            <br />
            { narrative ?
              <div>
                <h5>Consumer Complaint Narrative</h5>
                <span className="body-copy">
                  { narrative }
                </span>
              </div> :
               null
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
            { this._renderCompanyTimely( row.timely ) }
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
  onClickedBack: PropTypes.func,
  phase: PropTypes.string,
  row: PropTypes.object
}

ComplaintDetail.defaultProps = {
  onClickedBack: () => history.go( -1 ),
  phase: WAITING,
  row: {}
}

export const mapStateToProps = state => {
  const row = state.detail.data
  let phase = typeof row.date_received === 'undefined' ? WAITING : RESULTS

  // Phase Logic
  if ( state.detail.error ) {
    phase = ERROR
  }

  return {
    phase,
    row
  }
}

export const mapDispatchToProps = dispatch => ( {
  loadDetail: id => {
    dispatch( getComplaintDetail( id ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( ComplaintDetail )
