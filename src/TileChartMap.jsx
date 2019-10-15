import './TileChartMap.less';
import { connect } from 'react-redux';
import React from 'react';
import { TILE_MAP_STATES } from './constants';
import { TileMap } from 'cfpb-chart-builder';

export class TileChartMap extends React.Component {
  constructor( props ) {
    super( props );
    this.state = this._calculatePages( props );
  }

  componentDidMount() {
    if ( !this.state.data ) return;

    const chart = new TileMap( {
      el: document.getElementById( 'mymap' ),
      data: this.state.data,
      type: 'line',
      color: 'green'
    } );
  }

  componentDidUpdate( prevProps ) {
    const s1 = JSON.stringify( this.props.data );
    const s2 = JSON.stringify( prevProps.data );

    if ( s1 !== s2 ) {
      const chart = new TileMap( {
        el: document.getElementById( 'mymap' ),
        data: this.props.data,
        type: 'line',
        color: 'green'
      } );
    }

  }

  _calculatePages( props ) {
    return {
      data: props.data
    };
  }

  render() {
    return (
      <div>
        <div id="mymap"
             className="cfpb-chart"
             data-chart-color="navy"
             data-chart-description="This is the chart description."
             data-chart-title="Map about something"
             data-chart-type="tile_map">
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // Helper methods

  // --------------------------------------------------------------------------
  // Subrender methods
}

const mapStateToProps = state => {
  if ( state.aggs ) {
    // only get the 50 US states
    const states = Object.values( state.aggs.state )
      .filter( o => TILE_MAP_STATES.includes( o.key ) )
      .map( o => ( { name: o.key, value: o.doc_count } ) );

    const stateNames = states.map( o => o.name );

    // patch any missing data
    console.log( stateNames );
    TILE_MAP_STATES.forEach( o => {
      if ( !stateNames.includes( o ) ) {
        states.push( { name: o, value: 0 } );
      }
    } );
    return { data: [ states ]};
  }

  return {};
};

export default connect( mapStateToProps )( TileChartMap );

