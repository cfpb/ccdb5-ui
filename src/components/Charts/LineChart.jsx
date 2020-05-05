import './LineChart.less'
import * as d3 from 'd3'
import { line, tooltip } from 'britecharts'
import { connect } from 'react-redux'
import { getTipDate } from '../../utils/chart'
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
        false
    d3.select( chartID + ' .line-chart' ).remove()
    const lineChart = line()
    const tip = tooltip()

    const dateInterval = this.props.dateInterval
    // will be Start Date - Date...

    lineChart.margin( { left: 50, right: 10, top: 10, bottom: 40 } )
      .initializeVerticalMarker( true )
      .isAnimated( true )
      .tooltipThreshold( 1 )
      .grid( 'horizontal' )
      .aspectRatio( 0.5 )
      .width( containerWidth )
      .dateLabel( 'date' )
      .colorSchema( [ 'green' ] )
      .on( 'customMouseOver', tip.show )
      .on( 'customMouseMove', function(dataPoint, topicColorMap, dataPointXPosition) {
        tip.title( getTipDate( dataPoint.date, dateInterval ) )
        tip.update( dataPoint, topicColorMap, dataPointXPosition )
      } )
      .on( 'customMouseOut', tip.hide )

    container.datum( this.props.data ).call( lineChart )
    const tooltipContainer =
      d3.select( chartID + ' .metadata-group .vertical-marker-container' )
    tooltipContainer.datum( [] ).call( tip )
  }

  render() {
    return (
      <div>
        <h2>{ this.props.title }</h2>
        <div id="line-chart">
        </div>
      </div>
    )
  }
}

export const mapStateToProps = state => ( {
  data: state.trends.results.dateRangeLine,
  dateInterval: state.query.dateInterval
} )

export default connect( mapStateToProps )( LineChart )
