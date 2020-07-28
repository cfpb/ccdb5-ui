/* eslint complexity: ["error", 5] */
import CompanyTypeahead from '../Filters/CompanyTypeahead'
import { connect } from 'react-redux'
import { externalTooltipFormatter } from '../../utils/chart'
import iconMap from '../iconMap'
import React from 'react'
import { removeFilter } from '../../actions/filter'
import { sanitizeHtmlId } from '../../utils'

export class ExternalTooltip extends React.Component {
  _spanFormatter( value ) {
    const { focus, lens, showCompanyTypeahead, subLens } = this.props
    const elements = []
    const lensToUse = focus ? subLens : lens
    const plurals = {
      'Product': 'products',
      'product': 'products',
      'issue': 'issues',
      'Sub-Issue': 'sub-issues',
      'sub_product': 'sub-products',
      'Company': 'companies'
    }

    // Other should never be a selectable focus item
    if ( value.name === 'Other' ) {
      elements.push(
        <span className="u-left" key={ value.name }>
          All other { plurals[lensToUse] }
        </span>
      )
      return elements
    }

    if ( focus ) {
      elements.push(
        <span className="u-left" key={ value.name }>
          { value.name }
        </span>
      )
      return elements
    }

    elements.push( <span className="u-left"
                         id={ sanitizeHtmlId( 'focus-' + value.name ) }
                         key={ value.name }>
        { value.name }
      </span> )

    // add in the close button for Company and there's no focus yet
    if ( showCompanyTypeahead ) {
      elements.push( <span className="u-right a-btn a-btn__link close"
                           key={ 'close_' + value.name }
                           onClick={ () => {
                             this.props.remove( value.name )
                           } }>
        { iconMap.getIcon( 'delete' ) }
      </span> )
    }

    return elements
  }

  render() {
    const { focus, showTotal, tooltip } = this.props
    if ( tooltip && tooltip.values ) {
      return (
        <section
          className={ 'tooltip-container u-clearfix ' + focus }>
          { this.props.showCompanyTypeahead &&
          <CompanyTypeahead id={ 'external-tooltip' }/> }
          <p className="a-micro-copy">
            <span className={'heading'}>{ this.props.tooltip.heading }</span>
            <span className={'date'}>{ this.props.tooltip.date }</span>
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

            { showTotal && <ul className="m-list__unstyled tooltip-ul total">
              <li>
                <span className="u-left">Total</span>
                <span className="u-right">
                  { tooltip.total.toLocaleString() }
                </span>
              </li>
            </ul> }
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

export const mapStateToProps = state => {
  const { focus, lens, subLens } = state.query
  const { chartType, tooltip } = state.trends
  return {
    focus: focus ? 'focus' : '',
    lens,
    subLens,
    showCompanyTypeahead: lens === 'Company' && !focus,
    showTotal: chartType === 'area',
    tooltip: externalTooltipFormatter( tooltip )
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( ExternalTooltip )
