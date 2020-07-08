import './TrendDepthToggle.less'
import { changeDepth, resetDepth } from '../../actions/trends'
import { clamp, coalesce } from '../../utils'
import { connect } from 'react-redux'
import React from 'react'

export class TrendDepthToggle extends React.Component {
  render() {
    const { diff, showToggle } = this.props
    if ( showToggle ) {
      if ( diff > 0 ) {
        return <div className={ 'trend-depth-toggle' }>
          <button className={ 'a-btn a-btn__link' }
                  id={ 'trend-depth-button' }
                  onClick={ () => {
                    this.props.increaseDepth( diff )
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
                  this.props.resetDepth()
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

  const lensResultLength = coalesce( trends.results, lensKey, [] )
    .filter( o => o.visible ).length

  // The total source depends on the lens.  There are no aggs for companies
  let totalResultsLength = 0
  if ( lensKey === 'product' ) {
    totalResultsLength = coalesce( aggs, lensKey, [] ).length
  } else {
    totalResultsLength = clamp( coalesce( query, lensKey, [] ).length, 0, 10 )
  }

  return {
    diff: totalResultsLength - lensResultLength,
    showToggle: lensResultLength > 0 && !focus
  }
}

export default connect( mapStateToProps,
  mapDispatchToProps )( TrendDepthToggle )
