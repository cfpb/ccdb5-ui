import './SearchPanel.less'
import { connect } from 'react-redux'
import { FormattedDate } from 'react-intl'
import PillPanel from './PillPanel'
import React from 'react';
import SearchBar from './SearchBar'
import { shortIsoFormat } from './utils'

export class SearchPanel extends React.Component {
  render() {
    if (this.props.lastUpdated) {
      var shortDate = shortIsoFormat( new Date( this.props.lastUpdated ) );
      return (
	      <div className="search-panel">
	        <h2>Search complaint data <span className="date-subscript">(last updated: <FormattedDate value={ shortDate } />)</span></h2>
	        <SearchBar />
	        <PillPanel />
	      </div>
	    )
    } else {
    	return (
	      <div className="search-panel">
	        <h2>Search complaint data</h2>
	        <SearchBar />
	        <PillPanel />
	      </div>
	    )
    }
  }
}

const mapStateToProps = state => ( {
  lastUpdated: state.results.lastUpdated
} )

export default connect( mapStateToProps )( SearchPanel )
