import { connect } from 'react-redux'
import React from 'react'


export class ExternalTooltip extends React.Component {
  render() {
    const { tooltip } = this.props
    if ( tooltip && tooltip.values ) {
      return (
        <section className="tooltip-container u-clearfix">
          <p className="a-micro-copy">
            <span>Date interval: { tooltip.title }</span>
            </p>
          <div>
            <ul className="tooltip-ul">
              { tooltip.values.map( ( v, k ) =>
                <li className={ 'color__' + v.colorIndex } key={ k + '-id' }>
                  <span className="u-left">{ v.name }</span>
                  <span className="u-right">{ v.value.toLocaleString() }</span>
                </li>
              ) }
            </ul>

            <ul className="m-list__unstyled tooltip-ul total">
              <li>
                <span className="u-left">Total</span>
                <span className="u-right">{ tooltip.total.toLocaleString() }</span>
              </li>
            </ul>
          </div>
        </section>
      )
    }
    return null
  }
}

export const mapStateToProps = state => ( {
  tooltip: state.trends.tooltip
} )


export default connect( mapStateToProps )( ExternalTooltip )
