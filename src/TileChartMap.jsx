import './TileChartMap.less'
import { addStateFilter } from './actions/map'
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

    // force redraw when switching tabs
    if ( hashObject( prevProps ) !== hashObject( props ) ||
      !document.getElementById( 'tile-chart-map' ).children.length ) {
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

  _toggleState( event ) {
    const compProps = this.props
    // pass in redux dispatch
    // point.fullName
    const { abbr, fullName } = event.point
    const selectedState = { abbr, fullName }
    if ( compProps.selectedState.abbr !== abbr ) {
      compProps.mapShapeToggled( selectedState )
    }
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
      localize: true,
      events: {
        // custom event handlers we can pass on
        click: this._toggleState
      }
    } )
  }
}

export const getStateClass = ( statesFilter, abbr ) => {
  // no filters so no classes.
  if ( statesFilter.length === 0 ) {
    return ''
  }

  return statesFilter.includes( abbr ) ? 'selected' : 'deselected'
}

export const processStates = state => {
  const statesFilter = state.query.state || []
  const states = state.map.state
  const stateData = states.map( o => {
    o.className = getStateClass( statesFilter, o.abbr )
    return o
  } )
  return [ stateData ]
}

export const mapStateToProps = state => ( {
  data: processStates( state ),
  stateFilters: state.query.state,
  selectedState: state.map.selectedState
} )

export const mapDispatchToProps = dispatch => ( {
  mapShapeToggled: selectedState => {
    dispatch( addStateFilter( selectedState ) )
  }
} )


export default connect( mapStateToProps, mapDispatchToProps )( TileChartMap )

