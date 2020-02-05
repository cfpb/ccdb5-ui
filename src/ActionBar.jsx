import './ActionBar.less';
import { changeSize, changeSort } from './actions/paging'
import { connect } from 'react-redux'
import { FormattedNumber } from 'react-intl'
import React from 'react';
import { showExportDialog } from './actions/dataExport'

const sizes = [ 10, 25, 50, 100 ]

/* eslint-disable camelcase */

const sorts = {
  created_date_desc: 'Sort by newest to oldest',
  created_date_asc: 'Sort by oldest to newest',
  relevance_desc: 'Sort by relevance',
  relevance_asc: 'Sort by relevance (asc)'
}

/* eslint-enable camelcase */

export class ActionBar extends React.Component {
  render() {
    return (
        <summary className="action-bar">
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
            {this.props.view === 'List' &&
            <div className="cf-select flex-fixed">
              <select value={this.props.size} id="choose-size"
                      onChange={this.props.onSize}>
                { sizes.map(
                  x => <option key={x} value={x}>Show {x} results</option>
                  )}
              </select>
            </div>}
            {this.props.view === 'List' &&
            <div className="cf-select flex-fixed">
              <select value={this.props.sort} id="choose-sort"
                      onChange={this.props.onSort}>
                { Object.keys( sorts ).map( x =>
                  <option key={x} value={x}>{ sorts[x] }</option>
                  )}
              </select>
            </div>}
            <h4 className="flex-all">
              <button className="a-btn a-btn__link"
                      data-gtm_ignore="true"
                      onClick={this.props.onExportResults}>
                Export results
              </button>
            </h4>
          </div>
        </summary>
    );
  }
}

export const mapStateToProps = state => ( {
  size: state.query.size,
  sort: state.query.sort,
  hits: state.aggs.total,
  total: state.aggs.doc_count,
  view: state.query.tab
} )

export const mapDispatchToProps = dispatch => ( {
  onSize: ev => {
    const iSize = parseInt( ev.target.value, 10 )
    dispatch( changeSize( iSize ) )
  },
  onSort: ev => {
    dispatch( changeSort( ev.target.value ) )
  },
  onExportResults: () => {
    dispatch( showExportDialog() )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( ActionBar )
