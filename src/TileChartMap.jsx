import './TileChartMap.less'
import { connect } from 'react-redux'
import { hashObject } from './utils'
import React from 'react'
import { TileMap } from 'cfpb-chart-builder'

export class TileChartMap extends React.Component {
  componentDidUpdate( prevProps ) {
    const props = this.props
    if ( !props.data[0].length ) {
      return
    }

    if ( hashObject( prevProps.data ) !== hashObject( props.data ) ) {
      this._redrawMap()
    }
  }

  render() {
    return (
      <div>
        <div id="tile-chart-map"
             className="cfpb-chart"
             data-chart-type="tile_map">
        </div>
      </div>
    )
  }

  // --------------------------------------------------------------------------
  // Event Handlers
  _redrawMap() {
    const colors = [
      'rgba(247, 248, 249, 0.5)',
      'rgba(212, 231, 230, 0.5)',
      'rgba(180, 210, 209, 0.5)',
      'rgba(137, 182, 181, 0.5)',
      'rgba(86, 149, 148, 0.5)',
      'rgba(37, 116, 115, 0.5)'
    ]

    // eslint-disable-next-line no-unused-vars
    const chart = new TileMap( {
      el: document.getElementById( 'tile-chart-map' ),
      data: this.props.data,
      colors,
      localize: true
    } )
  }
}

export const mapStateToProps = state => ( { data: [ state.map.state ]} )

export default connect( mapStateToProps )( TileChartMap )

