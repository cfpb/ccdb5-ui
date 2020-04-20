import './PerCapita.less'
import { GEO_NORM_NONE, GEO_NORM_PER1000 } from './constants'
import { connect } from 'react-redux'
import { dataNormalizationChanged } from './actions/map';
import React from 'react'


export class PerCapita extends React.Component {
  _setNormalization( val ) {
    this.props.onDataNormalization( val )
  }

  _getRawButtonClass() {
    return this.props.dataNormalization === GEO_NORM_NONE ? 'selected' :
      'deselected'
  }

  _getPerCapButtonClass() {
    if ( this.props.enablePer1000 ) {
      return this.props.dataNormalization === GEO_NORM_PER1000 ? 'selected' :
        'deselected'
    }
    return 'a-btn__disabled'
  }
  render() {
    return (
      <section className="per-capita">
        <div className="per-capita m-btn-group">
          <p>Map shading</p>
          <button
            className={ 'a-btn raw ' + this._getRawButtonClass() }
            onClick={ () => this._setNormalization( GEO_NORM_NONE ) }>Complaints
          </button>
          <button
            className={ 'a-btn capita ' + this._getPerCapButtonClass() }
            onClick={ () =>
                this.props.enablePer1000 &&
                this._setNormalization( GEO_NORM_PER1000 ) }>
            Complaints per 1,000 <span>population</span>
          </button>
        </div>
      </section>
    )
  }
}

export const mapStateToProps = state => ( {
  dataNormalization: state.map.dataNormalization,
  enablePer1000: state.query.enablePer1000
} );

export const mapDispatchToProps = dispatch => ( {
  onDataNormalization: value => {
    dispatch( dataNormalizationChanged( value ) )
  }
} );

export default connect( mapStateToProps, mapDispatchToProps )( PerCapita )
