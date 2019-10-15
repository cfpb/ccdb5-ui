import { select, selectAll } from 'd3-selection';
import { connect } from 'react-redux';
import { line } from 'britecharts';
import React from 'react';


export class LineChart extends React.Component {
  constructor( props ) {
    super( props );
    this.state = this._calculatePages( props );
  }

  componentDidMount() {
    // if ( !this.state.data ) return;
    const lineContainer = select('#lineChart');
    const lineChart = line();

    lineChart.margin( { left: 30, right: 10, top: 10, bottom: 40 } )
      .initializeVerticalMarker( true )
      .isAnimated( true )
      .tooltipThreshold( 1 )
      .grid( 'horizontal' )
      .aspectRatio( 0.75 )
      .width( 600 )
      .dateLabel( 'date' );

    const rows = {
      dataRange: [
        {
          count: 2,
          max: 2487,
          sum: 4964,
          avg: 2482,
          min: 2477,
          date: '2017-01-01T00:00:00.000Z'
        },
        {
          count: 2,
          max: 2263,
          sum: 4300,
          avg: 2150,
          min: 2037,
          date: '2018-01-01T00:00:00.000Z'
        }
      ],
      dataByTopic: [
        {
          topicName: 'BANK OF AMERICA, NATIONAL ASSOCIATION',
          topic: 'BANK OF AMERICA, NATIONAL ASSOCIATION',
          show: true,
          readOnly: true,
          dates: [
            {
              date: '2017-01-01T00:00:00.000Z',
              value: 738
            },
            {
              date: '2018-01-01T00:00:00.000Z',
              value: 602
            }
          ]
        },
        {
          topicName: 'Average of comparison set',
          topic: 'Average of comparison set',
          dashed: true,
          show: true,
          readOnly: true,
          dates: [
            {
              date: '2017-01-01T00:00:00.000Z',
              value: 2482
            },
            {
              date: '2018-01-01T00:00:00.000Z',
              value: 2150
            }
          ]
        },
        {
          topicName: 'Sum of comparable companies',
          topic: 'Sum of comparable companies',
          show: true,
          readOnly: true,
          dates: [
            {
              date: '2017-01-01T00:00:00.000Z',
              value: 4964
            },
            {
              date: '2018-01-01T00:00:00.000Z',
              value: 4300
            }
          ]
        },
        {
          topicName: 'Experian Information Solutions Inc.',
          topic: 'Experian Information Solutions Inc.',
          recommended: '',
          show: false,
          readOnly: false,
          dates: [
            {
              date: '2017-01-01T00:00:00.000Z',
              value: 2487
            },
            {
              date: '2018-01-01T00:00:00.000Z',
              value: 2263
            }
          ]
        },
        {
          topicName: 'TRANSUNION INTERMEDIATE HOLDINGS, INC.',
          topic: 'TRANSUNION INTERMEDIATE HOLDINGS, INC.',
          recommended: '',
          show: false,
          readOnly: false,
          dates: [
            {
              date: '2017-01-01T00:00:00.000Z',
              value: 2477
            },
            {
              date: '2018-01-01T00:00:00.000Z',
              value: 2037
            }
          ]
        }
      ]
    };

    lineContainer.datum(rows).call(lineChart);
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
        <div id="lineChart">
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
  if(state === 'somethingelse')
    return false;
  return {};
};

export default connect( mapStateToProps )( LineChart );

