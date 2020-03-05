import './TileChartMap.less'
import { addStateFilter, removeStateFilter } from './actions/map'
import { debounce, hashObject } from './utils'
import { GEO_NORM_NONE, STATE_DATA } from './constants'
import { connect } from 'react-redux'
import { printModeChanged } from './actions/view'
import React from 'react'
import TileMap from './TileMap'

export class TileChartMap extends React.Component {
  constructor( props ) {
    super( props )

    // Bindings
    this._throttledRedraw = debounce( this._redrawMap.bind( this ), 200 );
    this._updatePrintStyle = this._togglePrintStyles.bind( this );
  }

  componentDidMount() {
    window.addEventListener( 'afterprint', this._updatePrintStyle );
    window.addEventListener( 'beforeprint', this._updatePrintStyle );
    window.addEventListener( 'resize', this._throttledRedraw );
  }

  componentDidUpdate( prevProps ) {
    const props = this.props
    if ( !props.data[0].length ) {
      return
    }

    // force redraw when switching tabs, or print mode changes
    if ( hashObject( prevProps ) !== hashObject( props ) ||
      !document.getElementById( 'tile-chart-map' ).children.length ) {
      this._redrawMap()
    }
  }

  componentWillUnmount() {
    window.removeEventListener( 'afterprint', this._updatePrintStyle );
    window.removeEventListener( 'beforeprint', this._updatePrintStyle );
    window.removeEventListener( 'resize', this._throttledRedraw );
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
    if ( compProps.stateFilters.includes( abbr ) ) {
      compProps.removeState( selectedState )
    } else {
      compProps.addState( selectedState )
    }
  }

  // --------------------------------------------------------------------------
  // Event Handlers

  _redrawMap() {
    const toggleState = this._toggleState
    const componentProps = this.props
    const mapElement = document.getElementById( 'tile-chart-map' )
    const { dataNormalization, printMode } = componentProps
    const elementWidth = mapElement ? mapElement.clientWidth : 700;
    const width = printMode ? 700 : elementWidth
    const data = updateData( this.props )

    const options = {
      el: mapElement,
      data,
      isPerCapita: dataNormalization !== GEO_NORM_NONE,
      events: {
        // custom event handlers we can pass on
        click: toggleState.bind( componentProps )
      },
      width
    }

    options.height = printMode ? 700 : width * 0.75;

    // eslint-disable-next-line no-unused-vars
    const chart = new TileMap( options )
  }

  _togglePrintStyles() {
    const compProps = this.props;
    compProps.togglePrintMode();
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

export const mapStateToProps = state => {
  const refStateFilters = state.query.state || []
  const { printMode } = state.view

  return {
    data: processStates( state ),
    dataNormalization: state.map.dataNormalization,
    printMode,
    stateFilters: [ ...refStateFilters ]
  }
}

export const mapDispatchToProps = dispatch => ( {
  addState: selectedState => {
    dispatch( addStateFilter( selectedState ) )
  },
  removeState: selectedState => {
    dispatch( removeStateFilter( selectedState ) )
  },
  togglePrintMode: () => {
    dispatch( printModeChanged() )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( TileChartMap )
