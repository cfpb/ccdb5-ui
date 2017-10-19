import './ComplaintDetail.less';
import { connect } from 'react-redux'
import { FormattedDate } from 'react-intl';
import { getComplaintDetail } from './actions/complaints'
import Loading from './Dialogs/Loading'
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
          <div className="back-to-search flex-fixed">
            <button className="a-btn a-btn__link"
                    onClick={this.props.onClickedBack}>
                <span className="cf-icon cf-icon-left"></span>
                Back to search results
            </button>
          </div>
          <div className="meaning flex-fixed">
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
            <h4>Date CFPB received the complaint</h4>
            <span className="body-copy">
              <FormattedDate value={ row.date_received } />
            </span>
            <br />
            <h4>Consumer's state</h4>
            <span className="body-copy">{ row.state }</span>
            <br />
            <h4>Consumer's zip</h4>
            <span className="body-copy">{ row.zip_code }</span>
            <br />
            <h4>Submitted via</h4>
            <span className="body-copy">{ row.submitted_via }</span>
            <br />
            <h4>Tags</h4>
            <span className="body-copy">{ row.tags }</span>
            <br />
            <h4>Did consumer dispute the response?</h4>
            <span className="body-copy">{ row.consumer_disputed }</span>
          </div>
          <div className="card-right layout-column">
            <h4>Product</h4>
            <h3>{ row.product }</h3>
            { this._renderSub( 'Sub-product:', row.sub_product ) }
            <br />
            <h4>Issue</h4>
            <h3>{ row.issue }</h3>
            { this._renderSub( 'Sub-issue:', row.sub_issue ) }
            <br />
            <h4>Consumer consent to publish narrative</h4>
            { this._renderConsumerConsent( row.consumer_consent_provided ) }
            <br />
            { narrative ?
              <div>
                <h4>Consumer complaint narrative</h4>
                <span className="body-copy">
                  { narrative }
                </span>
              </div> :
               null
            }
          </div>
        </div>

        <h2 className="company-information">Company information</h2>
        <div className="card">
          <div className="card-left layout-column">
            <h4>Date complaint sent to company</h4>
            <span className="body-copy">
              <FormattedDate value={ row.date_sent_to_company } />
            </span>
            <br />
            <h4>Company name</h4>
            <span className="body-copy">{ row.company }</span>
            <br />
          </div>
          <div className="card-right layout-column">
            <h4>Timely response?</h4>
            { this._renderCompanyTimely( row.timely ) }
            <br />
            <h4>Company response to consumer</h4>
            <span className="body-copy">{ row.company_response }</span>
            <br />
            <h4>Company public response</h4>
            <span className="body-copy">{ row.company_public_response }</span>
          </div>
        </div>
      </article>
    )
  }

  _renderSub( label, value ) {
    return (
      value ?
        <div className="layout-row">
          <span className="body-copy subitem">{ label }</span>
          <span className="body-copy">{ value }</span>
        </div> :
         null
    )
  }

  _renderWaiting() {
    return (
      <Loading isLoading={true} />
    )
  }

}

// ----------------------------------------------------------------------------
// Meta

ComplaintDetail.propTypes = {
  // eslint-disable-next-line camelcase
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
