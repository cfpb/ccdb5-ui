import './TrendDepthToggle.less'
import { changeDepth, resetDepth } from '../../actions/trends'
import { coalesce } from '../../utils'
import { connect } from 'react-redux'
import React from 'react'

export class TrendDepthToggle extends React.Component {
  render() {
    const { diff, lens, resetCount, showToggle } = this.props
    if ( showToggle ) {
      if ( diff > 0 ) {
        return <div className={ 'trend-depth-toggle' }>
          <button className={ 'a-btn a-btn__link' }
                  id={ 'trend-depth-button' }
                  onClick={ () => {
                    this.props.increaseDepth( diff )
                  } }>
            <span className={ 'plus' }></span>
            { `View ${ diff } more ${ lens.toLowerCase() }s` }
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
          { `View ${ resetCount } fewer ${ lens.toLowerCase() }s` }
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
  const prodLength = coalesce( trends.results, lensKey, [] )
    .filter( o => o.visible ).length
  const diff = coalesce( aggs, lensKey, [] ).length - prodLength

  return {
    diff,
    focus,
    lens,
    resetCount: prodLength - 5,
    showToggle: prodLength > 0 && !focus && lens === 'Product'
  }
}

export default connect( mapStateToProps,
  mapDispatchToProps )( TrendDepthToggle )
