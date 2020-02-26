import './TileChartMap.less'
import { GEO_NORM_NONE, STATE_DATA } from './constants'
import { addStateFilter } from './actions/map'
import { connect } from 'react-redux'
import { hashObject } from './utils'
import React from 'react'
import TileMap from './TileMap'

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
    // pass in redux dispatch
    // point.fullName
    const compProps = this
    const { abbr, fullName } = event.point
    const selectedState = {
      abbr,
      // rename this for consistency
      // chart builder uses fullName
      name: fullName
    }
    if ( !compProps.selectedState || compProps.selectedState.abbr !== abbr ) {
      compProps.mapShapeToggled( selectedState )
    }
  }

  // --------------------------------------------------------------------------
  // Event Handlers
  _redrawMap() {
    const toggleState = this._toggleState
    const componentProps = this.props

    const mapElement = document.getElementById( 'tile-chart-map' )
    const offsetWidth = mapElement ? mapElement.offsetWidth : 800;

    // eslint-disable-next-line no-mixed-operators
    const width = offsetWidth - offsetWidth * 0.1

    const description = componentProps.dataNormalization === GEO_NORM_NONE ?
      'Complaints' : 'Complaints per 1000'

    const data = updateData( this.props )

    // eslint-disable-next-line no-unused-vars
    const chart = new TileMap( {
      el: mapElement,
      description,
      data,
      isPerCapita: componentProps.dataNormalization !== GEO_NORM_NONE,
      events: {
        // custom event handlers we can pass on
        click: toggleState.bind( componentProps )
      },
      width
    } )
  }
}

/**
 * helper function to get display value of tile based on selected dropdown.
 * @param {object} props contains data and normalization
 * @returns {object} data provided to tile map
 */
function updateData( props ) {
  const { data, dataNormalization } = props
  const showDefault = dataNormalization === GEO_NORM_NONE
  const res = data[0].map( o => ( {
    ...o,
    displayValue: showDefault ? o.value : o.perCapita
  } ) )

  return res
}

/**
 * helper function to calculate percapita value
 * @param {object} stateObj a state containing abbr and value
 * @param {object} stateInfo other information about the state
 * @returns {string} the per capita value
 */
function getPerCapita( stateObj, stateInfo ) {
  const pop = stateInfo.population
  return ( stateObj.value / pop * 1000 ).toFixed( 2 )
}

export const getStateClass = ( statesFilter, name ) => {
  // no filters so no classes.
  if ( statesFilter.length === 0 ) {
    return ''
  }

  return statesFilter.includes( name ) ? 'selected' : 'deselected'
}

export const processStates = state => {
  const statesFilter = state.query.state || []
  const states = state.map.state
  const stateData = states.map( o => {
    const stateInfo = STATE_DATA[o.name] || { name: '', population: 1 }
    o.abbr = o.name
    o.fullName = stateInfo.name
    o.perCapita = getPerCapita( o, stateInfo )
    o.className = getStateClass( statesFilter, o.name )
    return o
  } )
  return [ stateData ]
}

export const mapStateToProps = state => ( {
  data: processStates( state ),
  dataNormalization: state.map.dataNormalization,
  stateFilters: state.query.state,
  selectedState: state.map.selectedState
} )

export const mapDispatchToProps = dispatch => ( {
  mapShapeToggled: selectedState => {
    dispatch( addStateFilter( selectedState ) )
  }
} )


export default connect( mapStateToProps, mapDispatchToProps )( TileChartMap )

