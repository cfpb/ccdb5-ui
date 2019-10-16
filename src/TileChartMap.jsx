import './TileChartMap.less';
import { connect } from 'react-redux';
import React from 'react';
import { TileMap } from 'cfpb-chart-builder';

export class TileChartMap extends React.Component {
  constructor( props ) {
    super( props );
    this.state = this._calculatePages( props );
  }

  componentDidMount() {
    if ( !this.state.data || this.state.data[0]
      && !this.state.data[0].length ) return;
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
        type: 'tile_map',
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
  if ( state.map ) {
    return { data: [ state.map.states ]};
  }
  return { data: false };
};

export default connect( mapStateToProps )( TileChartMap );

