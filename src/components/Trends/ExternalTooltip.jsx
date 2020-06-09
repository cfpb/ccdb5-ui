import CompanyTypeahead from '../Filters/CompanyTypeahead'
import { connect } from 'react-redux'
import iconMap from '../iconMap'
import React from 'react'
import { removeFilter } from '../../actions/filter'

export class ExternalTooltip extends React.Component {
  _spanFormatter( value ) {
    return this.props.showCompanyTypeahead ? [
      <span className="u-left a-btn a-btn__link" key={value.name}>
        { value.name }
      </span>,
      <span className="u-right a-btn a-btn__link close"
            key={ 'close_' + value.name }
            onClick={ () => {
              this.props.remove( value.name )
            } }>
        { iconMap.getIcon( 'delete' ) }
      </span>
    ] : <span className="u-left">{ value.name }</span>
  }

  render() {
    const { tooltip } = this.props
    if ( tooltip && tooltip.values ) {
      return (
        <section
          className={ 'tooltip-container u-clearfix ' + this.props.lens }>
          { this.props.showCompanyTypeahead && <CompanyTypeahead/> }
          <p className="a-micro-copy">
            <span>{ tooltip.title }</span>
          </p>
          <div>
            <ul className="tooltip-ul">
              { tooltip.values.map( ( v, k ) =>
                <li className={ 'color__' + v.colorIndex } key={ k + '-id' }>
                  { this._spanFormatter( v ) }
                  <span className="u-right">{ v.value.toLocaleString() }</span>
                </li>
              ) }
            </ul>

            <ul className="m-list__unstyled tooltip-ul total">
              <li>
                <span className="u-left">Total</span>
                <span className="u-right">
                  { tooltip.total.toLocaleString() }
                </span>
              </li>
            </ul>
          </div>
        </section>
      )
    }
    return null
  }
}


export const mapDispatchToProps = dispatch => ( {
  remove: value => {
    dispatch( removeFilter( 'company', value ) )
  }
} )

export const mapStateToProps = state => ( {
  lens: state.query.lens,
  showCompanyTypeahead: state.query.lens === 'Company',
  tooltip: state.trends.tooltip
} )


export default connect( mapStateToProps, mapDispatchToProps )( ExternalTooltip )
