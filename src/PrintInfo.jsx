import './PrintInfo.less';
import { knownFilters, SLUG_SEPARATOR } from './constants'
import { connect } from 'react-redux'
import React from 'react';
import { shortFormat } from './utils'

export class PrintInfo extends React.Component {

  render() {
    const { complaintCountText, dates, filters, searchText } = this.props
    return (
      <section className="print-info">
        <p>Dates: { dates }</p>
        { filters && <p>Filters: { filters }</p> }
        { searchText && <p>Search Term: { searchText }</p> }
        <p>{ complaintCountText }</p>
      </section>
    )
  }
}

const getComplaintCountText = aggs => {
  const { doc_count, total } = aggs
  if ( doc_count === total ) {
    return `Showing ${ total.toLocaleString() } complaints`
  }
  return `Showing ${ total.toLocaleString() } out of ` +
    `${ doc_count.toLocaleString() } total complaints`
}

const getDateText = query => {
  const { date_received_min, date_received_max } = query;
  return shortFormat( date_received_min ) + ' - ' +
    shortFormat( date_received_max );
}

const getFilterText = query => {
  const subState = query
  const filters = knownFilters
    // Only use the known filters that are in the substate
    .filter( x => x in subState )

  const outputFilters = []
  for ( let i = 0; i < filters.length; i++ ) {
    const subFilter = query[filters[i]]
    for ( let j = 0; j < subFilter.length; j++ ) {
      if ( subFilter[j].indexOf( SLUG_SEPARATOR ) > 0 ) {
        outputFilters.push( subFilter[j].split( SLUG_SEPARATOR )[1] )
      } else {
        outputFilters.push( subFilter[j] )
      }
    }
  }
  return outputFilters.join( ',' )
}

export const mapStateToProps = state => {
  const { aggs, query, view } = state
  const { printMode } = view
  return {
    complaintCountText: getComplaintCountText( aggs ),
    dates: getDateText( query ),
    filters: getFilterText( query ),
    searchText: query.searchText,
    url: window.location.href,
    printMode
  }
}

export default connect( mapStateToProps, )( PrintInfo );
