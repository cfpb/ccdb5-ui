import './PrintInfo.less';
import { connect } from 'react-redux'
import React from 'react';
import { shortFormat } from './utils'

export class PrintInfo extends React.Component {

  render() {
    const { complaintCountText, dates, searchText } = this.props
    return (
      <section className="print-info">
        <p>Dates: { dates }</p>
        { searchText && <p>Search Term: { searchText }</p> }
        <p>{ complaintCountText }</p>
      </section>
    )
  }
}

export const getComplaintCountText = aggs => {
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

export const mapStateToProps = state => {
  const { aggs, query } = state
  return {
    complaintCountText: getComplaintCountText( aggs ),
    dates: getDateText( query ),
    searchText: query.searchText
  }
}

export default connect( mapStateToProps, )( PrintInfo );
