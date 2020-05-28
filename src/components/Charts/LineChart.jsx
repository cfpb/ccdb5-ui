import './LineChart.less'
import * as d3 from 'd3'
import { line, tooltip } from 'britecharts'
import { connect } from 'react-redux'
import { getTipDate } from '../../utils/chart'
import { hashObject } from '../../utils'
import React from 'react'

export class LineChart extends React.Component {
  componentDidMount() {
    this._redrawChart()
  }

  componentDidUpdate( prevProps ) {
    const props = this.props
    console.log( prevProps, props )
    if ( hashObject( prevProps ) !== hashObject( props ) ) {
      console.log( props, prevProps )
      this._redrawChart()
    }
  }

  _redrawChart() {
    if ( !this.props.data.dataByTopic || !this.props.data.dataByTopic.length ) {
      return
    }

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
    const colorMap = this.props.colorMap
    const colorScheme = this.props.data.dataByTopic.map( o => colorMap[ o.topic ] )

    lineChart.margin( { left: 50, right: 10, top: 10, bottom: 40 } )
      .initializeVerticalMarker( true )
      .isAnimated( true )
      .tooltipThreshold( 1 )
      .grid( 'horizontal' )
      .aspectRatio( 0.5 )
      .width( containerWidth )
      .dateLabel( 'date' )
      .colorSchema( colorScheme )
      .on( 'customMouseOver', tip.show )
      .on( 'customMouseMove', function(dataPoint, topicColorMap, dataPointXPosition) {
        tip.title( getTipDate( dataPoint.date, dateInterval ) )
        tip.update( dataPoint, topicColorMap, dataPointXPosition )
      } )
      .on( 'customMouseOut', tip.hide )

    console.log( this.props.data )
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
  chartType: state.trends.chartType,
  colorMap: state.trends.colorMap,
  data: state.trends.results.dateRangeLine,
  dateInterval: state.query.dateInterval
} )

export default connect( mapStateToProps )( LineChart )
