import './DataExport.less'
import {
  exportAllResults, exportSomeResults, visitSocrata
} from '../actions/dataExport'
import { bindAll } from '../utils'
import { connect } from 'react-redux'
import { FormattedNumber } from 'react-intl'
import React from 'react'

// ----------------------------------------------------------------------------
// Modes

const PROMPTING = 'PROMPTING'
const NOTIFYING = 'NOTIFYING'

// ----------------------------------------------------------------------------

export class DataExport extends React.Component {
  constructor( props ) {
    super( props )

    this.state = this._validate( props )

    bindAll( this, [
      '_chooseDataset', '_chooseFormat', '_exportClicked'
    ] )
  }

  componentWillReceiveProps( nextProps ) {
    const nextState = this._validate( nextProps )
    this.setState( nextState )
  }

  render() {
    return (
      <section className="export-modal">
        <div className="header layout-row">
          <h3 className="flex-all">Export complaints</h3>
          <button className="a-btn a-btn__link"
                  data-gtm_ignore="true"
                  onClick={this.props.onClose}>
            Close
            <span className="cf-icon cf-icon-delete-round"></span>
          </button>
        </div>
        { this.state.mode === PROMPTING ?
          this._renderBodyPrompting() :
          this._renderBodyNotifying()
        }
        { this.state.mode === PROMPTING ?
          this._renderFooterPrompting() :
          null
        }
      </section>
    )
  }

  // --------------------------------------------------------------------------
  // Validation methods

  _validateDataset( state ) {
    if ( typeof state.dataset === 'undefined' ) {
      state.messages.dataset = 'You must choose which dataset to export'
    } else {
      delete state.messages.dataset
    }

    return state
  }

  _validateFormat( state ) {
    if ( typeof state.format === 'undefined' ) {
      state.messages.format = 'You must select a format for the export'
    } else {
      delete state.messages.format
    }

    return state
  }

  _validate( props ) {
    let nextState = {
      messages: {},
      mode: PROMPTING
    }

    // When there is no filter, always use full dataset
    if ( props.someComplaints === props.allComplaints ) {
      nextState.dataset = 'full'
    }

    nextState = this._validateDataset( nextState )
    nextState = this._validateFormat( nextState )

    return nextState
  }

  // --------------------------------------------------------------------------
  // Form helpers

  _chooseDataset( ev ) {
    const nextState = this._validateDataset( {
      dataset: ev.target.value,
      messages: this.state.messages
    } )
    this.setState( nextState )
  }

  _chooseFormat( ev ) {
    const nextState = this._validateFormat( {
      format: ev.target.value,
      messages: this.state.messages
    } )
    this.setState( nextState )
  }

  _exportClicked() {
    if ( this.state.dataset === 'full' ) {
      this.props.exportAll( this.state.format )
    } else {
      this.props.exportSome( this.state.format, this.props.someComplaints )
    }

    this.setState( { mode: NOTIFYING } )
  }

  // --------------------------------------------------------------------------
  // Subrender methods

  _renderBodyPrompting() {
    return (
        <div className="body">
          <div className="body-copy instructions">
            To download a copy of this dataset, choose the file format and
            which complaints you want to export below.
          </div>
          { this._renderFormatGroup() }
          { this.props.someComplaints === this.props.allComplaints ? null :
            this._renderDatasetGroup()
          }
          <div className="timeliness-warning">
            The export process could take several minutes if you're downloading
            many complaints
          </div>
        </div>
    )
  }

  _renderBodyNotifying() {
    return (
        <div className="body">
          <div className="body-copy instructions">
            It may take a few minutes for your file to download.
            You can keep working while it processes.
          </div>
        </div>
    )
  }

  _renderFooterPrompting() {
    return (
        <div className="footer layout-row">
          <button className="a-btn"
                  data-gtm_ignore="true"
                  disabled={ Object.keys( this.state.messages ).length > 0 }
                  onClick={this._exportClicked}>
            Start Export
          </button>
          <button className="a-btn a-btn__link a-btn__warning"
                  data-gtm_ignore="true"
                  onClick={this.props.onClose}>
            Cancel
          </button>
        </div>
    )
  }

  _renderFormatGroup() {
    return <div className="group">
            <div className="group-title">
              Select a format for the exported file
              <span className="required-helper"> (required)</span>
            </div>
            <div className="body-copy">
              <div className="m-form-field m-form-field__radio
                              m-form-field__lg-target">
                <input checked={this.state.format === 'csv'}
                       className="a-radio"
                       id="format_csv"
                       onChange={this._chooseFormat}
                       type="radio"
                       value="csv" />
                <label className="a-label" htmlFor="format_csv">CSV</label>
              </div>
              <div className="m-form-field m-form-field__radio
                              m-form-field__lg-target">
                <input checked={this.state.format === 'json'}
                       className="a-radio"
                       id="format_json"
                       onChange={this._chooseFormat}
                       type="radio"
                       value="json" />
                <label className="a-label" htmlFor="format_json">JSON</label>
              </div>
            </div>
            <div className="other-formats">
              Or you can&nbsp;
              <button className="a-btn a-btn__link"
                      data-gtm_ignore="true"
                      onClick={this.props.onOtherFormats}>
               download the data in a different format
              </button>
              , if needed.
            </div>
          </div>
  }

  _renderDatasetGroup() {
    return <div className="group">
            <div className="group-title">
              Select which complaints you'd like to export
              <span className="required-helper"> (required)</span>
            </div>
            <div className="body-copy">
              <div className="m-form-field m-form-field__radio
                              m-form-field__lg-target">
                <input checked={this.state.dataset === 'filtered'}
                       className="a-radio"
                       id="dataset_filtered"
                       onChange={this._chooseDataset}
                       type="radio"
                       value="filtered" />
                <label className="a-label" htmlFor="dataset_filtered">
                  <div className="multiline-label">
                    <div>
                      Filtered dataset (
                      <FormattedNumber value={this.props.someComplaints} />
                      &nbsp;complaints)
                    </div>
                    <div className="body-copy">
                    (only the results of the last search and/or filter)
                    </div>
                  </div>
                </label>
              </div>
              <div className="m-form-field m-form-field__radio
                              m-form-field__lg-target">
                <input checked={this.state.dataset === 'full'}
                       className="a-radio"
                       id="dataset_full"
                       onChange={this._chooseDataset}
                       type="radio"
                       value="full" />
                <label className="a-label" htmlFor="dataset_full">
                  <div className="multiline-label">
                    <div>
                      Full dataset (
                      <FormattedNumber value={this.props.allComplaints} />
                      &nbsp;complaints)
                    </div>
                    <div className="body-copy">
                    (not recommended due to very large file size)
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
  }
}

export const mapStateToProps = state => {
  const someComplaints = state.results.total
  const allComplaints = state.results.doc_count

  return {
    allComplaints,
    someComplaints
  }
}

export const mapDispatchToProps = dispatch => ( {
  onOtherFormats: () => dispatch( visitSocrata() ),
  exportAll: format => dispatch( exportAllResults( format ) ),
  exportSome: ( format, size ) => dispatch( exportSomeResults( format, size ) )
} )

export default connect( mapStateToProps, mapDispatchToProps )( DataExport )
