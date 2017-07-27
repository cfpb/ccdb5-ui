import React from 'react'
import { FormattedNumber } from 'react-intl'
import { connect } from 'react-redux'
import './DataExport.less'
import {
  exportAllResults, exportSomeResults, visitSocrata
} from '../actions/dataExport'

export class DataExport extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dataset: props.dataset,
      format: 'json'
    }

    this._chooseDataset = this._chooseDataset.bind(this)
    this._chooseFormat = this._chooseFormat.bind(this)
    this._exportClicked = this._exportClicked.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({dataset: nextProps.dataset});
  }

  render() {
    return (
      <section className='export-modal'>
        <div className="header layout-row">
          <h3 className='flex-all'>Export complaints</h3>
          <button className="a-btn a-btn__link"
                  onClick={this.props.onClose}>
            Close
            <span className="cf-icon cf-icon-delete-round"></span>
          </button>
        </div>
        <div className="body">
          <div className="body-copy instructions">
            To download a copy of this dataset, choose the file format and
            which complaints you want to export below.
          </div>

          <div className='group'>
            <div className='group-title'>
              Select a format for the exported file
            </div>
            <div className="m-form-field m-form-field__radio">
              <input checked={this.state.format === 'csv'}
                     className="a-radio"
                     id="format_csv"
                     onChange={this._chooseFormat}
                     type="radio"
                     value='csv' />
              <label className="a-label" htmlFor="format_csv">CSV</label>
            </div>
            <div className="m-form-field m-form-field__radio">
              <input checked={this.state.format === 'json'}
                     className="a-radio"
                     id="format_json"
                     onChange={this._chooseFormat} 
                     type="radio"
                     value='json' />
              <label className="a-label" htmlFor="format_json">JSON</label>
            </div>
            <div className="other-formats">
              Or you can&nbsp;
              <button className="a-btn a-btn__link"
                      onClick={this.props.onOtherFormats}>
               download the data in a different format
              </button>
              , if needed.
            </div>
          </div>

          { this.props.someComplaints === this.props.allComplaints ? null :
          <div className='group'>
            <div className='group-title'>
              Select which complaints you'd like to export
            </div>
            <div className="m-form-field m-form-field__radio">
              <input checked={this.state.dataset === 'filtered'}
                     className="a-radio"
                     id="dataset_filtered"
                     onChange={this._chooseDataset}
                     type="radio"
                     value='filtered' />
              <label className="a-label" htmlFor="dataset_filtered">
                <div className="multiline-label">
                  <div>
                    Filtered dataset (
                    <FormattedNumber value={this.props.someComplaints} />
                    &nbsp;complaints)
                  </div>
                  <div className='body-copy'>
                  (only the results of the last search and/or filter performed)
                  </div>
                </div>
              </label>
            </div>
            <div className="m-form-field m-form-field__radio">
              <input checked={this.state.dataset === 'full'}
                     className="a-radio"
                     id="dataset_full"
                     onChange={this._chooseDataset}
                     type="radio"
                     value='full' />
              <label className="a-label" htmlFor="dataset_full">
                <div className="multiline-label">
                  <div>
                    Full dataset (
                    <FormattedNumber value={this.props.allComplaints} />
                    &nbsp;complaints)
                  </div>
                  <div className='body-copy'>
                  (not recommended due to very large file size)
                  </div>
                </div>
              </label>
            </div>
          </div>
          }
          <div className="timeliness-warning">
            The export process could take several minutes if you're downloading many complaints
          </div>
        </div>
        <div className="footer layout-row">
          <button className="a-btn"
                  onClick={this._exportClicked}>
            Start Export
          </button>
          <button className="a-btn a-btn__link a-btn__warning"
                  onClick={this.props.onClose}>
            Cancel
          </button>            
        </div>
      </section>
    )
  }

  // --------------------------------------------------------------------------
  // Form helpers

  _chooseDataset(ev) {
    this.setState({
      dataset: ev.target.value
    });
  }

  _chooseFormat(ev) {
    this.setState({
      format: ev.target.value
    });
  }

  _exportClicked(ev) {
    if (this.state.dataset === 'full') {
      this.props.exportAll(this.state.format)
    }
    else {
      this.props.exportSome(this.state.format, this.props.someComplaints)
    }
  }
}

export const mapStateToProps = state => {
  const someComplaints = state.results.total
  const allComplaints = state.results.doc_count
  const dataset = (someComplaints === allComplaints) ? 'full' : 'filtered'

  return {
    allComplaints,
    dataset,
    someComplaints
  }
}

export const mapDispatchToProps = dispatch => {
  return {
    onOtherFormats: _ => dispatch(visitSocrata()),
    exportAll: (format) => dispatch(exportAllResults(format)),
    exportSome: (format, size) => dispatch(exportSomeResults(format, size))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataExport)
