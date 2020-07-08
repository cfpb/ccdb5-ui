/* eslint complexity: ["error", 5] */
import './TrendDepthToggle.less'
import { changeDepth, resetDepth } from '../../actions/trends'
import { clamp, coalesce } from '../../utils'
import { connect } from 'react-redux'
import React from 'react'
import { SLUG_SEPARATOR } from '../../constants'

const maxRows = 5

export class TrendDepthToggle extends React.Component {

  _showMore() {
    const { queryCount, resultCount } = this.props
    // scenarios where we want to show more:
    // you have less visible rows that the max (5)
    if ( resultCount <= maxRows ) {
      return true
    }
    // or more filters count > max Rows and they aren't the same (visible)
    return queryCount > maxRows && queryCount !== resultCount
  }

  render() {
    const { diff, increaseDepth, resetDepth, showToggle } = this.props
    if ( showToggle ) {
      if ( this._showMore() ) {
        return <div className={ 'trend-depth-toggle' }>
          <button className={ 'a-btn a-btn__link' }
                  id={ 'trend-depth-button' }
                  onClick={ () => {
                    increaseDepth( diff )
                  } }>
            <span className={ 'plus' }></span>
            Show more
          </button>
        </div>
      }
      return <div className={ 'trend-depth-toggle' }>
        <button className={ 'a-btn a-btn__link' }
                id={ 'trend-depth-button' }
                onClick={ () => {
                  resetDepth()
                } }>
          <span className={ 'minus' }></span>
          Show less
        </button>
      </div>
    }
    return null
  }
}


export const mapDispatchToProps = dispatch => ( {
  increaseDepth: diff => {
    dispatch( changeDepth( diff + 5 ) )
  },
  resetDepth: () => {
    dispatch( resetDepth() )
  }
} )

export const mapStateToProps = state => {
  const { aggs, query, trends } = state
  const { focus, lens } = query
  const lensKey = lens.toLowerCase()
  const resultCount = coalesce( trends.results, lensKey, [] )
    .filter( o => o.isParent ).length
  const lensResultLength = coalesce( trends.results, lensKey, [] )
    .filter( o => o.visible ).length

  // The total source depends on the lens.  There are no aggs for companies
  let totalResultsLength = 0
  if ( lensKey === 'product' ) {
    totalResultsLength = coalesce( aggs, lensKey, [] ).length
  } else {
    totalResultsLength = clamp( coalesce( query, lensKey, [] ).length, 0, 10 )
  }

  // handle cases where some specified filters are selected
  const queryCount = query[lensKey] ? query[lensKey]
      .filter( o => o.indexOf( SLUG_SEPARATOR ) === -1 ).length :
    totalResultsLength

  return {
    diff: totalResultsLength - lensResultLength,
    resultCount,
    queryCount,
    showToggle: !focus && ( lensResultLength > 5 || queryCount > 5 )
  }
}

export default connect( mapStateToProps,
  mapDispatchToProps )( TrendDepthToggle )
