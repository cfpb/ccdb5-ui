import './PrintInfo.less';
import { connect } from 'react-redux'
import React from 'react';
import { shortFormat } from './utils'

export class PrintInfo extends React.Component {

  render() {
    const { complaintCountText, dates, searchText } = this.props
    return (
      <section className="print-info">
        <p><span>Dates:</span> { dates }</p>
        { searchText && <p><span>Search Term:</span> { searchText }</p> }
        <div>{ complaintCountText }</div>
      </section>
    )
  }
}

export const getComplaintCountText = aggs => {
  const { doc_count: docCount, total } = aggs
  if ( docCount === total ) {
    return (
      <div>Showing <span>{ total.toLocaleString() }</span> complaints</div>
    )
  }
  return (
    <div>Showing <span>{ total.toLocaleString() }</span> out of
      <span> { docCount.toLocaleString() } </span> total complaints </div>
  )
}

const getDateText = query => {
  const { date_received_min: dateMin, date_received_max: dateMax } = query;
  return shortFormat( dateMin ) + ' - ' + shortFormat( dateMax );
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
