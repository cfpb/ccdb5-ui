import './PerCapita.less'
import { GEO_NORM_NONE, GEO_NORM_PER1000, knownFilters } from './constants'
import { connect } from 'react-redux'
import { dataNormalizationChanged } from './actions/map';
import React from 'react'


export class PerCapita extends React.Component {
  _setNormalization( val ) {
    this.props.onDataNormalization( val )
  }

  _getRawButtonClass() {
    return this.props.dataNormalization === GEO_NORM_NONE ? '' : 'deselected'
  }

  _getPerCapButtonClass() {
    if ( this.props.enablePer1000 ) {
      return this.props.dataNormalization === GEO_NORM_NONE ? 'deselected' : ''
    }
    return 'a-btn__disabled'
  }
  render() {
    return (
      <section className="per-capita">
        <div className="per-capita m-btn-group">
          <p>Map Shading</p>
          <label className="u-visually-hidden" htmlFor="data-normalization">
            Select the kind of shading to apply to the map
          </label>
          <button
            className={ 'a-btn raw ' + this._getRawButtonClass() }
            onClick={ () => this._setNormalization( GEO_NORM_NONE ) }>Complaints
          </button>
          <button
            className={ 'a-btn capita ' + this._getPerCapButtonClass() }
            onClick={ () =>
                this.props.enablePer1000 &&
                this._setNormalization( GEO_NORM_PER1000 ) }>
            Complaints per 1,000 population
          </button>
        </div>
      </section>
    )
  }
}

/**
 * helper function to determine if we have any filters selected so we can
 * disable the Per 1000 Complaints button
 * @param {object} query contains values for the filters, etc
 * @returns {boolean} are we enabling the perCap
 */
export const validatePerCapFilters = query => {
  const keys = []
  for ( let i = 0; i < knownFilters.length; i++ ) {
    const filter = knownFilters[i]
    if ( query[filter] && query[filter].length ) {
      keys.push( filter )
    }
  }
  return keys.length === 0
}

export const mapStateToProps = state => ( {
  dataNormalization: state.map.dataNormalization,
  enablePer1000: validatePerCapFilters( state.query )
} );

export const mapDispatchToProps = dispatch => ( {
  onDataNormalization: value => {
    dispatch( dataNormalizationChanged( value ) )
  }
} );

export default connect( mapStateToProps, mapDispatchToProps )( PerCapita )
