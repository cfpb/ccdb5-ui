import './LineChart.less'
import * as d3 from 'd3'
import { connect } from 'react-redux'
import React from 'react'
import { stackedArea } from 'britecharts'

export class StackedAreaChart extends React.Component {
  componentDidUpdate() {
    this._redrawChart()
  }

  _redrawChart() {
    const chartID = '#stacked-area-chart'
    const container = d3.select( chartID )
    const containerWidth =
      container.node() ?
        container.node().getBoundingClientRect().width :
        false
    d3.select( chartID + ' .stacked-area' ).remove()
    const stackedAreaChart = stackedArea()

    stackedAreaChart.margin( { left:50, right: 10, top: 10, bottom: 40 } )
      .initializeVerticalMarker( true )
      .isAnimated( false )
      .tooltipThreshold( 1 )
      .grid( 'horizontal' )
      .aspectRatio( 0.5 )
      .width( containerWidth )
      .dateLabel( 'date' )

    container.datum( this.props.data ).call( stackedAreaChart )
  }

  render() {
    return (
      <div>
        Texas complaints by date received
        <div id="stacked-area-chart">
        </div>
      </div>
    )
  }
}

// tbd: addin correct reducer here
export const mapStateToProps = state => ( {
  data: [
    {
      name: 'Shining', views: 0,
      dateUTC: '2011-01-05T00:00:00Z',
      date: '2011-01-05T00:00:00.000Z',
      value: 0
    },
    {
      name: 'Shining',
      views: 1000,
      dateUTC: '2011-01-06T00:00:00Z',
      date: '2011-01-06T00:00:00.000Z',
      value: 1000
    },
    {
      name: 'Shining',
      views: 1006.34,
      dateUTC: '2011-01-07T00:00:00Z',
      date: '2011-01-07T00:00:00.000Z',
      value: 1006.34
    },
    {
      name: 'Shining',
      views: 2000,
      dateUTC: '2011-01-08T00:00:00Z',
      date: '2011-01-08T00:00:00.000Z',
      value: 2000
    },
    {
      name: 'Luminous',
      views: 1003,
      dateUTC: '2011-01-05T00:00:00Z',
      date: '2011-01-05T00:00:00.000Z',
      value: 1003
    },
    {
      name: 'Luminous',
      views: 1006,
      dateUTC: '2011-01-06T00:00:00Z',
      date: '2011-01-06T00:00:00.000Z',
      value: 1006
    },
    {
      name: 'Luminous',
      views: 1000,
      dateUTC: '2011-01-07T00:00:00Z',
      date: '2011-01-07T00:00:00.000Z',
      value: 1000
    },
    {
      name: 'Luminous',
      views: 500,
      dateUTC: '2011-01-08T00:00:00Z',
      date: '2011-01-08T00:00:00.000Z',
      value: 500
    },
    {
      name: 'Vivid',
      views: 1000,
      dateUTC: '2011-01-05T00:00:00Z',
      date: '2011-01-05T00:00:00.000Z',
      value: 1000
    },
    {
      name: 'Vivid',
      views: 2000,
      dateUTC: '2011-01-06T00:00:00Z',
      date: '2011-01-06T00:00:00.000Z',
      value: 2000
    },
    {
      name: 'Vivid',
      views: 2002,
      dateUTC: '2011-01-07T00:00:00Z',
      date: '2011-01-07T00:00:00.000Z',
      value: 2002
    },
    {
      name: 'Vivid',
      views: 700,
      dateUTC: '2011-01-08T00:00:00Z',
      date: '2011-01-08T00:00:00.000Z',
      value: 700
    },
    {
      name: 'Intense',
      views: 0,
      dateUTC: '2011-01-05T00:00:00Z',
      date: '2011-01-05T00:00:00.000Z',
      value: 0
    },
    {
      name: 'Intense',
      views: 1000,
      dateUTC: '2011-01-06T00:00:00Z',
      date: '2011-01-06T00:00:00.000Z',
      value: 1000
    },
    {
      name: 'Intense',
      views: 1006,
      dateUTC: '2011-01-07T00:00:00Z',
      date: '2011-01-07T00:00:00.000Z',
      value: 1006
    },
    {
      name: 'Intense',
      views: 300,
      dateUTC: '2011-01-08T00:00:00Z',
      date: '2011-01-08T00:00:00.000Z',
      value: 300
    },
    {
      name: 'Radiant',
      views: 1008,
      dateUTC: '2011-01-05T00:00:00Z',
      date: '2011-01-05T00:00:00.000Z',
      value: 1008
    },
    {
      name: 'Radiant',
      views: 1002,
      dateUTC: '2011-01-06T00:00:00Z',
      date: '2011-01-06T00:00:00.000Z',
      value: 1002
    },
    {
      name: 'Radiant',
      views: 500,
      dateUTC: '2011-01-07T00:00:00Z',
      date: '2011-01-07T00:00:00.000Z',
      value: 500
    },
    {
      name: 'Radiant',
      views: 300,
      dateUTC: '2011-01-08T00:00:00Z',
      date: '2011-01-08T00:00:00.000Z',
      value: 300
    },
    {
      name: 'Brilliant Long Title Haha Testing 124 Yolo BaBar',
      views: 400,
      dateUTC: '2011-01-05T00:00:00Z',
      date: '2011-01-05T00:00:00.000Z',
      value: 400
    },
    {
      name: 'Brilliant Long Title Haha Testing 124 Yolo BaBar',
      views: 900,
      dateUTC: '2011-01-06T00:00:00Z',
      date: '2011-01-06T00:00:00.000Z',
      value: 900
    },
    {
      name: 'Brilliant Long Title Haha Testing 124 Yolo BaBar',
      views: 600,
      dateUTC: '2011-01-07T00:00:00Z',
      date: '2011-01-07T00:00:00.000Z',
      value: 600
    },
    {
      name: 'Brilliant Long Title Haha Testing 124 Yolo BaBar',
      views: 300,
      dateUTC: '2011-01-08T00:00:00Z',
      date: '2011-01-08T00:00:00.000Z',
      value: 300
    }, {
      name: 'Shing',
      views: 0,
      dateUTC: '2011-01-05T00:00:00Z',
      date: '2011-01-05T00:00:00.000Z',
      value: 0
    }, {
      name: 'Shing',
      views: 1000,
      dateUTC: '2011-01-06T00:00:00Z',
      date: '2011-01-06T00:00:00.000Z',
      value: 1000
    }, {
      name: 'Shing',
      views: 1006.34,
      dateUTC: '2011-01-07T00:00:00Z',
      date: '2011-01-07T00:00:00.000Z',
      value: 1006.34
    }, {
      name: 'Shing',
      views: 2000,
      dateUTC: '2011-01-08T00:00:00Z',
      date: '2011-01-08T00:00:00.000Z',
      value: 2000
    }, {
      name: 'ing',
      views: 0,
      dateUTC: '2011-01-05T00:00:00Z',
      date: '2011-01-05T00:00:00.000Z',
      value: 0
    }, {
      name: 'ing',
      views: 1000,
      dateUTC: '2011-01-06T00:00:00Z',
      date: '2011-01-06T00:00:00.000Z',
      value: 1000
    }, {
      name: 'ing',
      views: 1006.34,
      dateUTC: '2011-01-07T00:00:00Z',
      date: '2011-01-07T00:00:00.000Z',
      value: 1006.34
    }, {
      name: 'ing',
      views: 2000,
      dateUTC: '2011-01-08T00:00:00Z',
      date: '2011-01-08T00:00:00.000Z',
      value: 2000
    }, {
      name: 'bar',
      views: 0,
      dateUTC: '2011-01-05T00:00:00Z',
      date: '2011-01-05T00:00:00.000Z',
      value: 0
    }, {
      name: 'bar',
      views: 1000,
      dateUTC: '2011-01-06T00:00:00Z',
      date: '2011-01-06T00:00:00.000Z',
      value: 1000
    },
    {
      name: 'bar',
      views: 1006.34,
      dateUTC: '2011-01-07T00:00:00Z',
      date: '2011-01-07T00:00:00.000Z',
      value: 1006.34
    },
    {
      name: 'bar',
      views: 2000,
      dateUTC: '2011-01-08T00:00:00Z',
      date: '2011-01-08T00:00:00.000Z',
      value: 2000
    },
    {
      name: 'b1',
      views: 0,
      dateUTC: '2011-01-05T00:00:00Z',
      date: '2011-01-05T00:00:00.000Z',
      value: 0
    },
    {
      name: 'b1',
      views: 1000,
      dateUTC: '2011-01-06T00:00:00Z',
      date: '2011-01-06T00:00:00.000Z',
      value: 1000
    },
    {
      name: 'b1',
      views: 1006.34,
      dateUTC: '2011-01-07T00:00:00Z',
      date: '2011-01-07T00:00:00.000Z',
      value: 1006.34
    },
    {
      name: 'b1',
      views: 2000,
      dateUTC: '2011-01-08T00:00:00Z',
      date: '2011-01-08T00:00:00.000Z',
      value: 2000
    } ]
} )

export default connect( mapStateToProps )( StackedAreaChart )
