import { select, selectAll } from 'd3-selection';
import { connect } from 'react-redux';
import React from 'react';
import { row } from 'britecharts';


export class RowChart extends React.Component {
  constructor( props ) {
    super( props );
    this.state = this._calculatePages( props );
  }

  componentDidMount() {
    // if ( !this.state.data ) return;
    const rowContainer = select('#rowchart');
    const rowChart = row();
    rowChart.margin({
      left: 120,
      right: 20,
      top: 20,
      bottom: 5
    })
    .percentageAxisToMaxRatio(1.3)
    .width(600)
    .height(300);

    const rows = [
      {
        isNotFilter: false,
        isParent: true,
        name: 'America',
        value: 2,
        width: 0.5
      },
      {
        isNotFilter: false,
        isParent: true,
        name: 'Bank',
        value: 2,
        width: 0.5
      },
      {
        isNotFilter: false,
        isParent: true,
        name: 'Something',
        value: 2,
        width: 0.5
      },
      {
        isNotFilter: false,
        isParent: true,
        name: 'Wells',
        value: 2,
        width: 0.5
      },
      {
        isNotFilter: false,
        isParent: false,
        name: 'Equifax',
        value: 1,
        width: 0.5
      }
    ];
    rowContainer.datum(rows).call(rowChart);
  }

  // componentDidUpdate( prevProps ) {
  //   // const s1 = JSON.stringify( this.props.data );
  //   // const s2 = JSON.stringify( prevProps.data );
  //   //
  //   // if ( s1 !== s2 ) {
  //   //   const chart = new TileMap( {
  //   //     el: document.getElementById( 'mymap' ),
  //   //     data: this.props.data,
  //   //     type: 'tile_map',
  //   //     color: 'green'
  //   //   } );
  //   // }
  // }

  _calculatePages( props ) {
    return {
      data: props.data
    };
  }

  render() {
    return (
      <div>
        <div id="rowchart">
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
  if(state === 'yourmom')
    return false;
  return {};
};

export default connect( mapStateToProps )( RowChart );

