import './LineChart.less'
import * as d3 from 'd3'
import { connect } from 'react-redux'
import { line } from 'britecharts'
import React from 'react'

export class LineChart extends React.Component {
  componentDidUpdate() {
    this._redrawChart()
  }

  _redrawChart() {
    const chartID = '#line-chart'
    const container = d3.select( chartID )
    const containerWidth =
      container.node() ?
        container.node().getBoundingClientRect().width :
        false;
    d3.select( chartID + ' .line-chart' ).remove()
    const lineChart = line()

    lineChart.margin( { left: 50, right: 10, top: 10, bottom: 40 } )
      .initializeVerticalMarker( true )
      .isAnimated( true )
      .tooltipThreshold( 1 )
      .grid( 'horizontal' )
      .aspectRatio( 0.5 )
      .width( containerWidth )
      .dateLabel( 'date' )

    container.datum( this.props.data ).call( lineChart )
  }

  render() {
    return (
      <div>
        Complaints by date received
        <div id="line-chart">
        </div>
      </div>
    )
  }
}

// tbd: addin correct reducer here
export const mapStateToProps = state => ( {
  data: {
    dataByTopic: [ {
      topic: 103,
      dashed: true,
      show: false,
      dates: [ {
        date: '2015-06-27T16:00:00-08:00',
        value: 1,
        fullDate: '2015-06-27T16:00:00-08:00'
      }, {
        date: '2015-06-28T16:00:00-08:00',
        value: 1,
        fullDate: '2015-06-28T16:00:00-08:00'
      }, {
        date: '2015-06-29T16:00:00-08:00',
        value: 4,
        fullDate: '2015-06-29T16:00:00-08:00'
      }, {
        date: '2015-06-30T16:00:00-08:00',
        value: 2,
        fullDate: '2015-06-30T16:00:00-08:00'
      }, {
        date: '2015-07-01T16:00:00-08:00',
        value: 3,
        fullDate: '2015-07-01T16:00:00-08:00'
      }, {
        date: '2015-07-02T16:00:00-08:00',
        value: 3,
        fullDate: '2015-07-02T16:00:00-08:00'
      }, {
        date: '2015-07-03T16:00:00-08:00',
        value: 0,
        fullDate: '2015-07-03T16:00:00-08:00'
      }, {
        date: '2015-07-04T16:00:00-08:00',
        value: 3,
        fullDate: '2015-07-04T16:00:00-08:00'
      }, {
        date: '2015-07-05T16:00:00-08:00',
        value: 1,
        fullDate: '2015-07-05T16:00:00-08:00'
      }, {
        date: '2015-07-06T16:00:00-08:00',
        value: 2,
        fullDate: '2015-07-06T16:00:00-08:00'
      }, {
        date: '2015-07-07T16:00:00-08:00',
        value: 0,
        fullDate: '2015-07-07T16:00:00-08:00'
      } ],
      topicName: 'San Francisco'
    }, {
      topic: 149,
      show: false,
      dashed: true,
      dates: [ {
        date: '2015-06-27T16:00:00-08:00',
        value: 0,
        fullDate: '2015-06-27T16:00:00-08:00'
      }, {
        date: '2015-06-28T16:00:00-08:00',
        value: 2,
        fullDate: '2015-06-28T16:00:00-08:00'
      }, {
        date: '2015-06-29T16:00:00-08:00',
        value: 4,
        fullDate: '2015-06-29T16:00:00-08:00'
      }, {
        date: '2015-06-30T16:00:00-08:00',
        value: 3,
        fullDate: '2015-06-30T16:00:00-08:00'
      }, {
        date: '2015-07-01T16:00:00-08:00',
        value: 1,
        fullDate: '2015-07-01T16:00:00-08:00'
      }, {
        date: '2015-07-02T16:00:00-08:00',
        value: 3,
        fullDate: '2015-07-02T16:00:00-08:00'
      }, {
        date: '2015-07-03T16:00:00-08:00',
        value: 3,
        fullDate: '2015-07-03T16:00:00-08:00'
      }, {
        date: '2015-07-04T16:00:00-08:00',
        value: 1,
        fullDate: '2015-07-04T16:00:00-08:00'
      }, {
        date: '2015-07-05T16:00:00-08:00',
        value: 2,
        fullDate: '2015-07-05T16:00:00-08:00'
      }, {
        date: '2015-07-06T16:00:00-08:00',
        value: 2,
        fullDate: '2015-07-06T16:00:00-08:00'
      }, {
        date: '2015-07-07T16:00:00-08:00',
        value: 4,
        fullDate: '2015-07-07T16:00:00-08:00'
      } ],
      topicName: 'Unknown Location with a super hyper mega very very very long name.'
    }, {
      topic: 60,
      dashed: false,
      show: true,
      dates: [ {
        date: '2015-06-27T16:00:00-08:00',
        value: 0,
        fullDate: '2015-06-27T16:00:00-08:00'
      }, {
        date: '2015-06-28T16:00:00-08:00',
        value: 0,
        fullDate: '2015-06-28T16:00:00-08:00'
      }, {
        date: '2015-06-29T16:00:00-08:00',
        value: 18,
        fullDate: '2015-06-29T16:00:00-08:00'
      }, {
        date: '2015-06-30T16:00:00-08:00',
        value: 1,
        fullDate: '2015-06-30T16:00:00-08:00'
      }, {
        date: '2015-07-01T16:00:00-08:00',
        value: 6,
        fullDate: '2015-07-01T16:00:00-08:00'
      }, {
        date: '2015-07-02T16:00:00-08:00',
        value: 0,
        fullDate: '2015-07-02T16:00:00-08:00'
      }, {
        date: '2015-07-03T16:00:00-08:00',
        value: 0,
        fullDate: '2015-07-03T16:00:00-08:00'
      }, {
        date: '2015-07-04T16:00:00-08:00',
        value: 0,
        fullDate: '2015-07-04T16:00:00-08:00'
      }, {
        date: '2015-07-05T16:00:00-08:00',
        value: 0,
        fullDate: '2015-07-05T16:00:00-08:00'
      }, {
        date: '2015-07-06T16:00:00-08:00',
        value: 0,
        fullDate: '2015-07-06T16:00:00-08:00'
      }, {
        date: '2015-07-07T16:00:00-08:00',
        value: 15,
        fullDate: '2015-07-07T16:00:00-08:00'
      } ],
      topicName: 'Los Angeles'
    }, {
      topic: 81,
      dashed: false,
      show: true,
      dates: [ {
        date: '2015-06-27T16:00:00-08:00',
        value: 0,
        fullDate: '2015-06-27T16:00:00-08:00'
      }, {
        date: '2015-06-28T16:00:00-08:00',
        value: 0,
        fullDate: '2015-06-28T16:00:00-08:00'
      }, {
        date: '2015-06-29T16:00:00-08:00',
        value: 1,
        fullDate: '2015-06-29T16:00:00-08:00'
      }, {
        date: '2015-06-30T16:00:00-08:00',
        value: 0,
        fullDate: '2015-06-30T16:00:00-08:00'
      }, {
        date: '2015-07-01T16:00:00-08:00',
        value: 0,
        fullDate: '2015-07-01T16:00:00-08:00'
      }, {
        date: '2015-07-02T16:00:00-08:00',
        value: 0,
        fullDate: '2015-07-02T16:00:00-08:00'
      }, {
        date: '2015-07-03T16:00:00-08:00',
        value: 0,
        fullDate: '2015-07-03T16:00:00-08:00'
      }, {
        date: '2015-07-04T16:00:00-08:00',
        value: 0,
        fullDate: '2015-07-04T16:00:00-08:00'
      }, {
        date: '2015-07-05T16:00:00-08:00',
        value: 0,
        fullDate: '2015-07-05T16:00:00-08:00'
      }, {
        date: '2015-07-06T16:00:00-08:00',
        value: 0,
        fullDate: '2015-07-06T16:00:00-08:00'
      }, {
        date: '2015-07-07T16:00:00-08:00',
        value: 0,
        fullDate: '2015-07-07T16:00:00-08:00'
      } ],
      topicName: 'Oakland'
    }, {
      topic: 0,
      topicName: 'Other',
      dashed: true,
      show: true,
      dates: [ {
        date: '2015-06-27T16:00:00-08:00',
        value: 3,
        fullDate: '2015-06-27T16:00:00-08:00'
      }, {
        date: '2015-06-28T16:00:00-08:00',
        value: 9,
        fullDate: '2015-06-28T16:00:00-08:00'
      }, {
        date: '2015-06-29T16:00:00-08:00',
        value: 6,
        fullDate: '2015-06-29T16:00:00-08:00'
      }, {
        date: '2015-06-30T16:00:00-08:00',
        value: 11,
        fullDate: '2015-06-30T16:00:00-08:00'
      }, {
        date: '2015-07-01T16:00:00-08:00',
        value: 7,
        fullDate: '2015-07-01T16:00:00-08:00'
      }, {
        date: '2015-07-02T16:00:00-08:00',
        value: 10,
        fullDate: '2015-07-02T16:00:00-08:00'
      }, {
        date: '2015-07-03T16:00:00-08:00',
        value: 5,
        fullDate: '2015-07-03T16:00:00-08:00'
      }, {
        date: '2015-07-04T16:00:00-08:00',
        value: 10,
        fullDate: '2015-07-04T16:00:00-08:00'
      }, {
        date: '2015-07-05T16:00:00-08:00',
        value: 8,
        fullDate: '2015-07-05T16:00:00-08:00'
      }, {
        date: '2015-07-06T16:00:00-08:00',
        value: 10,
        fullDate: '2015-07-06T16:00:00-08:00'
      }, {
        date: '2015-07-07T16:00:00-08:00',
        value: 6,
        fullDate: '2015-07-07T16:00:00-08:00'
      } ]
    } ],
    dataByDate: [ {
      date: '2015-06-27T16:00:00-08:00',
      topics: [ {
        name: 103,
        value: 1,
        topicName: 'San Francisco'
      }, { name: 60, value: 0, topicName: 'Los Angeles' }, {
        name: 81,
        value: 0,
        topicName: 'Oakland'
      }, {
        name: 149,
        value: 0,
        topicName: 'Unknown Location with a super hyper mega very very very long name.'
      },
        { name: 0, value: 3, topicName: 'Other' }
      ]
    }, {
      date: '2015-06-28T16:00:00-08:00',
      topics: [ {
        name: 103,
        value: 1,
        topicName: 'San Francisco'
      }, {
        name: 149,
        value: 2,
        topicName: 'Unknown Location with a super hyper mega very very very long name.'
      }, { name: 60, value: 0, topicName: 'Los Angeles' }, {
        name: 81,
        value: 0,
        topicName: 'Oakland'
      }, { name: 0, value: 9, topicName: 'Other' } ]
    }, {
      date: '2015-06-29T16:00:00-08:00',
      topics: [ {
        name: 60,
        value: 18,
        topicName: 'Los Angeles'
      }, { name: 81, value: 1, topicName: 'Oakland' }, {
        name: 103,
        value: 4,
        topicName: 'San Francisco'
      }, {
        name: 149,
        value: 4,
        topicName: 'Unknown Location with a super hyper mega very very very long name.'
      }, { name: 0, value: 6, topicName: 'Other' } ]
    }, {
      date: '2015-06-30T16:00:00-08:00',
      topics: [ {
        name: 60,
        value: 1,
        topicName: 'Los Angeles'
      }, {
        name: 103,
        value: 2,
        topicName: 'San Francisco'
      }, {
        name: 149,
        value: 3,
        topicName: 'Unknown Location with a super hyper mega very very very long name.'
      }, { name: 81, value: 0, topicName: 'Oakland' }, {
        name: 0,
        value: 11,
        topicName: 'Other'
      } ]
    }, {
      date: '2015-07-01T16:00:00-08:00',
      topics: [ {
        name: 60,
        value: 6,
        topicName: 'Los Angeles'
      }, {
        name: 103,
        value: 3,
        topicName: 'San Francisco'
      }, {
        name: 149,
        value: 1,
        topicName: 'Unknown Location with a super hyper mega very very very long name.'
      }, { name: 81, value: 0, topicName: 'Oakland' }, {
        name: 0,
        value: 7,
        topicName: 'Other'
      } ]
    }, {
      date: '2015-07-02T16:00:00-08:00',
      topics: [ {
        name: 103,
        value: 3,
        topicName: 'San Francisco'
      }, {
        name: 149,
        value: 3,
        topicName: 'Unknown Location with a super hyper mega very very very long name.'
      }, { name: 60, value: 0, topicName: 'Los Angeles' }, {
        name: 81,
        value: 0,
        topicName: 'Oakland'
      }, { name: 0, value: 10, topicName: 'Other' } ]
    }, {
      date: '2015-07-03T16:00:00-08:00',
      topics: [ {
        name: 149,
        value: 3,
        topicName: 'Unknown Location with a super hyper mega very very very long name.'
      }, { name: 60, value: 0, topicName: 'Los Angeles' }, {
        name: 81,
        value: 0,
        topicName: 'Oakland'
      }, { name: 103, value: 0, topicName: 'San Francisco' }, {
        name: 0,
        value: 5,
        topicName: 'Other'
      } ]
    }, {
      date: '2015-07-04T16:00:00-08:00',
      topics: [ {
        name: 103,
        value: 3,
        topicName: 'San Francisco'
      }, {
        name: 149,
        value: 1,
        topicName: 'Unknown Location with a super hyper mega very very very long name.'
      }, { name: 60, value: 0, topicName: 'Los Angeles' }, {
        name: 81,
        value: 0,
        topicName: 'Oakland'
      }, { name: 0, value: 10, topicName: 'Other' } ]
    }, {
      date: '2015-07-05T16:00:00-08:00',
      topics: [ {
        name: 103,
        value: 1,
        topicName: 'San Francisco'
      }, {
        name: 149,
        value: 2,
        topicName: 'Unknown Location with a super hyper mega very very very long name.'
      }, { name: 60, value: 0, topicName: 'Los Angeles' }, {
        name: 81,
        value: 0,
        topicName: 'Oakland'
      }, { name: 0, value: 8, topicName: 'Other' } ]
    }, {
      date: '2015-07-06T16:00:00-08:00',
      topics: [ {
        name: 103,
        value: 2,
        topicName: 'San Francisco'
      }, {
        name: 149,
        value: 2,
        topicName: 'Unknown Location with a super hyper mega very very very long name.'
      }, { name: 60, value: 0, topicName: 'Los Angeles' }, {
        name: 81,
        value: 0,
        topicName: 'Oakland'
      }, { name: 0, value: 10, topicName: 'Other' } ]
    }, {
      date: '2015-07-07T16:00:00-08:00',
      topics: [ {
        name: 60,
        value: 15,
        topicName: 'Los Angeles'
      }, {
        name: 149,
        value: 4,
        topicName: 'Unknown Location with a super hyper mega very very very long name.'
      }, { name: 81, value: 0, topicName: 'Oakland' }, {
        name: 103,
        value: 0,
        topicName: 'San Francisco'
      }, { name: 0, value: 6, topicName: 'Other' } ]
    } ],
    dataRange: [ {
      date: '2015-06-27T16:00:00-08:00',
      max: 4,
      min: 2
    }, {
      date: '2015-06-28T16:00:00-08:00',
      max: 3,
      min: 2
    }, {
      date: '2015-06-29T16:00:00-08:00',
      max: 5,
      min: 4
    }, {
      date: '2015-06-30T16:00:00-08:00',
      max: 5,
      min: 4
    }, {
      date: '2015-07-01T16:00:00-08:00',
      max: 3,
      min: 1
    }, {
      date: '2015-07-02T16:00:00-08:00',
      max: 3,
      min: 1
    }, {
      date: '2015-07-03T16:00:00-08:00',
      max: 3,
      min: 1
    }, {
      date: '2015-07-04T16:00:00-08:00',
      max: 3,
      min: 1
    }, {
      date: '2015-07-05T16:00:00-08:00',
      max: 3,
      min: 1
    }, {
      date: '2015-07-06T16:00:00-08:00',
      max: 3,
      min: 1
    }, { date: '2015-07-07T16:00:00-08:00', max: 15, min: 10 } ]
  }
} )

export default connect( mapStateToProps )( LineChart )
