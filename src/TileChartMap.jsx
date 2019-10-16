import './TileChartMap.less';
import { connect } from 'react-redux';
import React from 'react';
import { TileMap } from 'cfpb-chart-builder';

export class TileChartMap extends React.Component {
  componentDidUpdate( prevProps ) {
    if(!this.props.data[0].length) {
      return;
    }

    const colors = [
      'rgba(247, 248, 249, 0.5)',
      'rgba(212, 231, 230, 0.5)',
      'rgba(180, 210, 209, 0.5)',
      'rgba(137, 182, 181, 0.5)',
      'rgba(86, 149, 148, 0.5)',
      'rgba(37, 116, 115, 0.5)'
    ];

    const chart = new TileMap( {
      el: document.getElementById( 'mymap' ),
      data: this.props.data,
      colors,
      localize: true
    } );
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

const mapStateToProps = state => ( { data: [ state.map.state ] } );

export default connect( mapStateToProps )( TileChartMap );

