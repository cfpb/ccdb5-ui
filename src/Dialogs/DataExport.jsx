import React from 'react'
import './DataExport.less'

export class DataExport extends React.Component {
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
          <div className="instructions">
            To download a copy of this dataset, choose the file format and
            which complaints you want to export below.
          </div>

          <div className='group'>
            <div className='group-title'>
              Select a format for the exported file
            </div>
            <div className="m-form-field m-form-field__radio">
                <input className="a-radio" type="radio" id="format_csv"/>
                <label className="a-label" for="format_csv">CSV</label>
            </div>
            <div className="m-form-field m-form-field__radio">
                <input className="a-radio" type="radio" id="format_json" />
                <label className="a-label" for="format_json">JSON</label>
            </div>
          </div>

          <div className='group'>
            <div className='group-title'>
              Select which complaints you'd like to export
            </div>
            <div className="m-form-field m-form-field__radio">
                <input className="a-radio" type="radio" id="dataset_filtered" />
                <label className="a-label" for="dataset_filtered">
                  <div className="multiline-label">
                    <div>Filtered dataset (xxx,xxx complaints)</div>
                    <div className='caveat'>
                    (only the results of the last search and/or filter performed)
                    </div>
                  </div>
                </label>
            </div>
            <div className="m-form-field m-form-field__radio">
                <input className="a-radio" type="radio" id="dataset_full" />
                <label className="a-label" for="dataset_full">
                  <div className="multiline-label">
                    <div>Full dataset (xxx,xxx complaints)</div>
                    <div className='caveat'>
                    (not recommended due to very large file size)
                    </div>
                  </div>
                </label>
            </div>
          </div>
          <div className="timeliness-warning">
            The export process could take several minutes if you're downloading many complaints
          </div>
        </div>
        <div className="footer layout-row">
          <button className="a-btn">Start Export</button>
          <button className="a-btn a-btn__link a-btn__warning"
                  onClick={this.props.onClose}>
            Cancel
          </button>            
        </div>
      </section>
    )
  }
}

export default DataExport