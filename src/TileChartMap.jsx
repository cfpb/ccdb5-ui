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

  componentWillReceiveProps( nextProps ) {
    this.setState( this._calculatePages( nextProps ) );
  }

  _calculatePages( props ) {
    return {
      data: props.data
    };
  }

  render() {
    return (
      <div>
        <h2 id="section-tilemap">
          TileMap
        </h2>
        <h3>Percentage change in the volume of new auto loans</h3>
        <div id="mymap"
             className="cfpb-chart"
             data-chart-color="navy"
             data-chart-description="This is the chart description."
             data-chart-title="Map about something"
             data-chart-type="tile_map">
          This is the chart description.
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
    const d = Object.values( state.aggs.state )
      .filter( o => TILE_MAP_STATES.includes( o.key ) )
      .map( o => ( { name: o.key, value: o.doc_count } ) );

    return { data: [ d ] };
  }

  return {};
};

export default connect( mapStateToProps )( TileChartMap );

