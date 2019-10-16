import { connect } from 'react-redux';
import { line } from 'britecharts';
import React from 'react';
import { select } from 'd3-selection';

export class LineChart extends React.Component {
  componentDidUpdate() {
    const lineContainer = select( '#lineChart' );
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

    lineContainer.datum( rows ).call( lineChart );
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

// tbd: addin correct reducer here
const mapStateToProps = state => ( { data: state.map.state } );

export default connect( mapStateToProps )( LineChart );

