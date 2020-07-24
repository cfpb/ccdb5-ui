import './ActionBar.less';
import { connect } from 'react-redux'
import { FormattedNumber } from 'react-intl'
import iconMap from './iconMap'
import React from 'react';
import { sendAnalyticsEvent } from '../utils'
import { showExportDialog } from '../actions/dataExport'

export class ActionBar extends React.Component {
  render() {
    const { hits, tab, total } = this.props
    return (
      <div>
        <summary className="action-bar" id="search-summary">
          <div>{ hits === total ?
            <h2>
              Showing&nbsp;
              <FormattedNumber value={ total }/>
              &nbsp;total complaints
            </h2> :
            <h2>
              Showing&nbsp;
              <FormattedNumber value={ hits }/>
              &nbsp;matches out of&nbsp;
              <FormattedNumber value={ total }/>
              &nbsp;total complaints</h2>
          }
          </div>
          <div>
            <h3 className="h4 flex-all export-results">
              <button className="a-btn a-btn__link export-btn"
                      data-gtm_ignore="true"
                      onClick={ () => {
                        this.props.onExportResults( tab )
                      } }>
                Export data
              </button>
              <button className="a-btn a-btn__link print-preview"
                      onClick={ () => {
                        this._showPrintView( tab )
                      } }>
                { iconMap.getIcon( 'printer' ) }
                Print
              </button>
            </h3>
          </div>
        </summary>
        </div>
    );
  }

  _showPrintView( tab ) {
    sendAnalyticsEvent( 'Print', 'tab:' + tab )
    const printUrl = window.location.href + '&printMode=true&fromExternal=true'
    window.location.assign( printUrl )
  }
}

export const mapStateToProps = state => ( {
  hits: state.aggs.total,
  printMode: state.view.printMode,
  total: state.aggs.doc_count,
  tab: state.query.tab
} )

export const mapDispatchToProps = dispatch => ( {
  onExportResults: tab => {
    sendAnalyticsEvent( 'Export', tab + ':User Opens Export Modal' )
    dispatch( showExportDialog() )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( ActionBar )
