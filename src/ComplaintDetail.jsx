import './ComplaintDetail.less';
import { bindAll } from './utils'
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

    bindAll( this, [
      '_renderBackDefault', '_renderBackDirect',
      '_renderError', '_renderResults', '_renderWaiting'
    ] )

    // Render/Phase Map
    this.renderMap = {
      ERROR: this._renderError,
      WAITING: this._renderWaiting,
      RESULTS: this._renderResults
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
            { this._selectWhichBackButton( document ) }
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
  // Global Access Methods

  _selectWhichBackButton( doc ) {
    return doc.referrer === '' ?
      this._renderBackDirect() :
      this._renderBackDefault()
  }

  _getRootUrl( fullPath ) {
    const idx = fullPath.indexOf( 'detail' )
    return fullPath.substring( 0, idx )
  }

  // --------------------------------------------------------------------------
  // Subrender Methods

  _renderBackDefault() {
    return (
      <button className="a-btn a-btn__link"
              onClick={this.props.onClickedBack}>
          {/* Includes custom cf-icon-left class to set color. */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 559.6 1200" className="cf-icon-svg cf-icon-left"><path d="M494.5 1090.7c-17.3 0-33.8-6.8-46-19L19 642.1c-25.4-25.4-25.4-66.5 0-91.9l429.5-429.5c25.6-25.1 66.8-24.8 91.9.8 24.8 25.3 24.8 65.8 0 91.1L156.9 596.2l383.6 383.6c25.4 25.4 25.4 66.5.1 91.9-12.3 12.2-28.8 19-46.1 19z"></path></svg>
          Back to search results
      </button>
    )
  }

  _renderBackDirect() {
    const root = this._getRootUrl( location.pathname )
    return (
      <button className="a-btn a-btn__link"
              onClick={() => { window.location = root }}>
          {/* Includes custom cf-icon-left class to set color. */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 559.6 1200" className="cf-icon-svg cf-icon-left"><path d="M494.5 1090.7c-17.3 0-33.8-6.8-46-19L19 642.1c-25.4-25.4-25.4-66.5 0-91.9l429.5-429.5c25.6-25.1 66.8-24.8 91.9.8 24.8 25.3 24.8 65.8 0 91.1L156.9 596.2l383.6 383.6c25.4 25.4 25.4 66.5.1 91.9-12.3 12.2-28.8 19-46.1 19z"></path></svg>
          Go to search home page
      </button>
    )
  }

  _renderCompanyTimely( value ) {
    const styles = [ 'cf-icon__before' ]
    if ( value.toLowerCase() === 'no' ) {
      styles.push( 'not-timely' )
    }

    return (
      <div>
        <span className="cf-icon__before">
          {/*
            Includes custom cf-icon-clock-round
            and not-timely (set via condition) class to set color.
          */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1200" class="{ 'cf-icon-svg cf-icon-clock-round ' + ( value.toLowerCase() === 'no' ? 'not-timely' : '' ) }"><path d="M606.1 354.2c-139.1-59-299.8 5.9-358.8 145.1s5.9 299.8 145.1 358.8c139.1 59 299.8-5.9 358.8-145.1 43.6-102.7 20.5-221.5-58.4-300.4-24.9-24.9-54.3-44.7-86.7-58.4zM636 542.6L517.9 660.7c-.3.3-.6.5-.8.8l-.5.4-.5.4-.6.5-.4.3-.7.5-.3.2-.7.4-.3.2-.7.4-.4.2-.6.3-.5.2-.6.3-.5.2-.5.2-.6.2-.5.2-.7.2-.5.2-.8.2-.4.1-.8.2-.4.1-.8.1-.5.1-.7.1H497.8l-.7-.1-.5-.1-.8-.1-.4-.1-.8-.2-.4-.1-.8-.2-.4-.1-.7-.2-.5-.2-.6-.2-.5-.2-.5-.2-.6-.3-.5-.2-.6-.3-.4-.2-.7-.4-.4-.2-.7-.4-.4-.2-.6-.5-.4-.3-.6-.5-.5-.4-.5-.4c-.3-.3-.6-.5-.9-.8-.3-.3-.5-.6-.8-.8l-.4-.5-.4-.5-.5-.6-.3-.4c-.2-.2-.3-.4-.5-.7l-.2-.3c-.1-.2-.3-.5-.4-.7l-.2-.3c-.1-.2-.3-.5-.4-.7l-.2-.4c-.1-.2-.2-.4-.3-.7l-.2-.4-.3-.6-.2-.5-.2-.5c-.1-.2-.2-.4-.2-.6l-.2-.5c-.1-.2-.1-.5-.2-.7l-.1-.4c-.1-.2-.1-.5-.2-.8s-.1-.3-.1-.4-.1-.5-.2-.8 0-.3-.1-.4-.1-.5-.1-.8 0-.3-.1-.5-.1-.5-.1-.7v-.7-.6V414c0-13.8 11.2-25 25-25s25 11.2 25 25V582.8l75.4-75.4c9.8-9.8 25.6-9.8 35.4 0s9.8 25.6 0 35.4l-.1-.2z"></path><path d="M500 105.2c-276.1 0-500 223.9-500 500s223.9 500 500 500 500-223.9 500-500-223.9-500-500-500zm0 822.7c-178.1 0-322.5-144.4-322.5-322.5S321.9 282.8 500 282.8s322.5 144.4 322.5 322.5S678.1 927.9 500 927.9z"></path></svg>
        </span>
        <span className="body-copy">{ value }</span>
      </div>
    )
  }

  _renderConsumerConsent( value ) {
    // Each SVG includes custom classes for setting color.
    const cfIconApprovedRound = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1200" className="cf-icon-svg cf-icon-approved-round"><path d="M500 105.2c-276.1 0-500 223.9-500 500s223.9 500 500 500 500-223.9 500-500-223.9-500-500-500zm259 284.2L481.4 870.3c-8.2 14.1-22.7 23.4-39 24.8-1.4.1-2.9.2-4.3.2-14.8 0-28.9-6.6-38.4-18L244.4 690.9c-17.9-21-15.4-52.6 5.7-70.5 21-17.9 52.6-15.4 70.5 5.7.2.3.5.5.7.8l109.4 131.4 241.8-418.8c13.6-24 44.2-32.4 68.2-18.8 24 13.6 32.4 44.2 18.8 68.2l-.5.5z"></path></svg>;
    const cfIconDeleteRound = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1200" className="cf-icon-svg cf-icon-delete-round"><path d="M500 105.2c-276.1 0-500 223.9-500 500s223.9 500 500 500 500-223.9 500-500-223.9-500-500-500zm261.8 692.2c19.4 19.6 19.3 51.3-.3 70.7-19.5 19.3-50.9 19.3-70.4 0L499.6 676.6 308 868.1c-19.6 19.4-51.3 19.3-70.7-.3-19.3-19.5-19.3-50.9 0-70.4l191.6-191.5-191.6-191.6c-19.3-19.8-18.9-51.4.9-70.7 19.4-18.9 50.4-18.9 69.8 0l191.6 191.5 191.5-191.5c19.6-19.4 51.3-19.3 70.7.3 19.3 19.5 19.3 50.9 0 70.4L570.3 605.9l191.5 191.5z"></path></svg>;
    const cfIconMinusRound = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1200" className="cf-icon-svg cf-icon-minus-round"><path d="M500 105.2c-276.1 0-500 223.9-500 500s223.9 500 500 500 500-223.9 500-500-223.9-500-500-500zm263.1 550.7H236c-27.6 0-50-22.4-50-50s22.4-50 50-50h527.1c27.6 0 50 22.4 50 50s-22.4 50-50 50z"></path></svg>;
    const cfIconHelpRound = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1200" className="cf-icon-svg cf-icon-help-round"><path d="M500 105.2c-276.1 0-500 223.9-500 500s223.9 500 500 500 500-223.9 500-500-223.9-500-500-500zm59.5 816.2c-6.5 15.2-18.6 27.3-33.7 33.7l-.3.1c-7.7 3.2-15.9 4.9-24.2 4.9-25.8.2-49.2-15.1-59.3-38.9-10.2-23.7-4.8-51.2 13.6-69.3 6-5.7 12.9-10.3 20.6-13.4 7.9-3.3 16.5-5 25.1-5 8.3 0 16.5 1.7 24.2 5l.2.1c7.5 3.2 14.3 7.7 20.2 13.4 18.3 18.2 23.6 45.6 13.6 69.4zm115.7-430.5c-4.1 15.2-10.1 29.9-17.7 43.7-7 12.4-15.1 24.2-24.2 35.1-8.8 10.4-17.3 20.3-25.4 29.5-.4.4-.8.8-1.2 1.3-7.6 8-14.6 15.6-20.8 22.9-6.6 7.6-12.4 15.9-17.4 24.7-5.2 9.2-9.1 19.1-11.8 29.3-2.8 10.7-4.3 23.2-4.3 37.2v2.2c0 27.4-22.4 49.8-50 49.8s-50-22.4-50-50v-2.2c0-22.7 2.6-43.8 7.6-62.9 4.9-18.6 12.1-36.4 21.6-53.2 8.2-14.3 17.7-27.8 28.5-40.3 7.1-8.3 15.1-17 23.6-26 7.3-8.3 15.1-17.3 23.1-26.8 5.2-6.3 9.8-13 13.8-20.1 3.6-6.7 6.4-13.8 8.4-21.2 1.4-5.1 3.1-14.1 3.1-28.4a80.7 80.7 0 0 0-6.2-32.5c-4.1-10.1-10.1-19.2-17.7-27-7.5-7.6-16.5-13.7-26.4-17.8-9.7-4.2-20.1-6.2-30.7-6-10.9-.2-21.7 1.9-31.7 6.2-20.5 8.5-36.7 24.8-45.2 45.3-4.3 10-6.4 20.9-6.2 31.8v1.2c0 27.6-22.4 50-50 50s-50-22.4-50-50v-1.3c0-25.5 4.7-48.8 14.3-71.2 18.5-44 53.5-79 97.4-97.6 22.4-9.7 45.8-14.4 71.3-14.4 24.2-.2 48.3 4.7 70.5 14.4 43.7 18.7 78.3 53.7 96.4 97.6 9.5 22.5 14.1 45.8 14.1 71.4 0 20.5-2.3 39.1-6.8 55.3z"></path></svg>;
    const cfIconErrorRound = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1200" className="cf-icon-svg cf-icon-error-round"><path d="M500 105.2c-276.1 0-500 223.9-500 500s223.9 500 500 500 500-223.9 500-500-223.9-500-500-500zm261.8 692.2c19.4 19.6 19.3 51.3-.3 70.7-19.5 19.3-50.9 19.3-70.4 0L499.6 676.6 308 868.1c-19.6 19.4-51.3 19.3-70.7-.3-19.3-19.5-19.3-50.9 0-70.4l191.6-191.5-191.6-191.6c-19.3-19.8-18.9-51.4.9-70.7 19.4-18.9 50.4-18.9 69.8 0l191.6 191.5 191.5-191.5c19.6-19.4 51.3-19.3 70.7.3 19.3 19.5 19.3 50.9 0 70.4L570.3 605.9l191.5 191.5z"></path></svg>;

    const iconMap = {
      'Consent provided': cfIconApprovedRound,
      'Consent not provided': cfIconDeleteRound,
      'Consent withdrawn': cfIconMinusRound,
      'N/A': cfIconHelpRound,
      'Other': cfIconHelpRound
    }

    let consentIcon;
    if ( value in iconMap ) {
      consentIcon = iconMap[value];
    } else {
      consentIcon = cfIconErrorRound;
      value = 'No data available'
    }

    return (
      <div>
        <span className="cf-icon__before">
          { consentIcon }
        </span>
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
