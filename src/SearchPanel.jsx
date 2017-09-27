import './SearchPanel.less'
import { connect } from 'react-redux'
import { FormattedDate } from 'react-intl'
import PillPanel from './PillPanel'
import React from 'react';
import SearchBar from './SearchBar'
import { shortIsoFormat } from './utils'

export class SearchPanel extends React.Component {
  render() {
    var lastUpdatedMessage = null;

    if ( this.props.lastUpdated ) {
      lastUpdatedMessage = <span className="date-subscript">(last updated: <FormattedDate value={ this.props.lastUpdated } />)</span>
    }

    return (
        <div className="search-panel">
          <h2>Search complaint data { lastUpdatedMessage }</h2>
          <SearchBar />
          <PillPanel />
        </div>
    )
  }
}

const mapStateToProps = state => ( {
  lastUpdated: state.results.lastUpdated
} )

export default connect( mapStateToProps )( SearchPanel )
