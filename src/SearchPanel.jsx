import './SearchPanel.less'
import { connect } from 'react-redux'
import { FormattedDate } from 'react-intl'
import PillPanel from './PillPanel'
import React from 'react';
import SearchBar from './SearchBar'
import shortIsoFormat from './utils.jsx'

export class SearchPanel extends React.Component {
  render() {
    // Adjust UTC to local timezone
    // This code adjusts for daylight saving time
    // but does not work for locations east of Greenwich
    var utcDate = new Date( this.props.lastUpdated )
    var localTimeThen = new Date(
      utcDate.getFullYear(),
      utcDate.getMonth(),
      utcDate.getDate() + 1
    )

    var tryagain = utcDate.toISOString().substring( 0, 10 );

    return (
      <div className="search-panel">
        <h2>Search complaint data <span className="date-subscript">(last updated: <FormattedDate value={ tryagain } />)</span></h2>
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
