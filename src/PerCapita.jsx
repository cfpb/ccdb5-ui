import './PerCapita.less'
import { GEO_NORM_NONE, GEO_NORM_PER1000 } from './constants'
import { connect } from 'react-redux'
import { dataNormalizationChanged } from './actions/map';
import React from 'react'


export class PerCapita extends React.Component {
  render() {
    return (
      <section className="per-capita">
        <p>Map Shading</p>
        <label className="u-visually-hidden" htmlFor="data-normalization">
          Select the kind of shading to apply to the map
        </label>
        <select value={this.props.dataNormalization}
                onChange={this.props.onDataNormalization}
                id="data-normalization">
          <option value={GEO_NORM_NONE}>Complaints</option>
          <option value={GEO_NORM_PER1000}>Per 1000 population</option>
        </select>
      </section>
    )
  }
}

export const mapStateToProps = state => ( {
  dataNormalization: state.map.dataNormalization
} );

export const mapDispatchToProps = dispatch => ( {
  onDataNormalization: ev => {
    dispatch( dataNormalizationChanged( ev.target.value ) )
  }
} );

export default connect( mapStateToProps, mapDispatchToProps )( PerCapita )
