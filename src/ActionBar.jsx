import './ActionBar.less';
import { connect } from 'react-redux'
import { FormattedNumber } from 'react-intl'
import iconMap from './iconMap'
import React from 'react';
import { showExportDialog } from './actions/dataExport'

export class ActionBar extends React.Component {
  render() {
    return (
      <div>
        <summary className="action-bar" id="search-summary">
          <div>{ this.props.hits === this.props.total ?
             <h2>
                 Showing&nbsp;
                 <FormattedNumber value={this.props.total} />
                 &nbsp;total complaints
              </h2> :
             <h2>
                Showing&nbsp;
                <FormattedNumber value={this.props.hits} />
                &nbsp;matches out of&nbsp;
                <FormattedNumber value={this.props.total} />
                &nbsp;total complaints</h2>
          }
          </div>
          <div className="layout-row">
            <h3 className="h4 flex-all export-results">
              <button className="a-btn a-btn__link"
                      data-gtm_ignore="true"
                      onClick={this.props.onExportResults}>
                Export data
              </button>
              <button className="a-btn a-btn__link print-preview"
                      data-gtm_ignore="true"
                      onClick={ this._showPrintView }>
                { iconMap.getIcon( 'printer' ) }
                Print
              </button>
            </h3>
          </div>
        </summary>
        </div>
    );
  }

  _showPrintView() {
    window.location.href += '&printMode=true&fromExternal=true'
  }
}

export const mapStateToProps = state => ( {
  hits: state.aggs.total,
  printMode: state.view.printMode,
  total: state.aggs.doc_count,
  view: state.query.tab
} )

export const mapDispatchToProps = dispatch => ( {
  onExportResults: () => {
    dispatch( showExportDialog() )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( ActionBar )
