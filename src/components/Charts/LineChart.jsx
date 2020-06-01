import './LineChart.less'
import * as d3 from 'd3'

import { getLastLineDate, getTooltipTitle } from '../../utils/chart'
import { line, tooltip } from 'britecharts'
import { connect } from 'react-redux'
import { hashObject } from '../../utils'
import { isDateEqual } from '../../utils/formatDate'
import PropTypes from 'prop-types'
import React from 'react'
import { updateTrendsTooltip } from '../../actions/trends'

export class LineChart extends React.Component {
  componentDidMount() {
    this._redrawChart()
  }

  componentDidUpdate( prevProps ) {
    const props = this.props
    if ( hashObject( prevProps.data ) !== hashObject( props.data ) ||
      hashObject( prevProps.width ) !== hashObject( props.width ) ||
      hashObject( prevProps.printMode ) !== hashObject( props.printMode ) ) {
      this._redrawChart()
    }
  }

  _tipStuff( evt ) {
    console.log( this.props.tooltip.date + evt.date )

    if ( !isDateEqual( this.props.tooltip.date, evt.key ) ) {
      this.props.tooltipUpdated( {
        date: evt.date,
        dateRange: {
          from: '',
          to: ''
        },
        interval: this.props.interval,
        values: evt.topics
      } )
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

    const interval = this.props.interval
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

    if ( this.props.lens === 'Overview' ) {
      const dateRange = this.props.dateRange
      lineChart
        .on( 'customMouseOver', tip.show )
        .on( 'customMouseMove', function ( dataPoint, topicColorMap, dataPointXPosition ) {
          tip.title( getTooltipTitle( dataPoint.date, interval, dateRange ) )
          tip.update( dataPoint, topicColorMap, dataPointXPosition )
        } )
        .on( 'customMouseOut', tip.hide )
    } else {
      lineChart.on( 'customMouseMove', this._tipStuff.bind( this ) )
    }

    container.datum( this.props.data ).call( lineChart )
    const tooltipContainer =
      d3.select( chartID + ' .metadata-group .vertical-marker-container' )
    tooltipContainer.datum( [] ).call( tip )

    const config = {
      dateRange: {
        from: '',
        to: ''
      },
      interval: this.props.interval,
      lastDate: this.props.lastDate
    }

    const payload = {
      date: this.props.lastDate,
      dateRange: this.props.dateRange,
      interval: this.props.interval,
      values: this.props.data.topics
    }
    // get the last date and fire it off to redux
    console.log( getLastLineDate( this.props.data, config ) )

    this.props.tooltipUpdated( getLastLineDate( this.props.data, config ) )
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

export const mapDispatchToProps = dispatch => ( {
  tooltipUpdated: selectedState => {
    // Analytics.sendEvent(
    //   Analytics.getDataLayerOptions( 'Trend Event: add',
    //     selectedState.abbr, )
    // )
    dispatch( updateTrendsTooltip( selectedState ) )
  }
} )

export const mapStateToProps = state => ( {
  colorMap: state.trends.colorMap,
  data: state.trends.results.dateRangeLine,
  dateRange: {
    from: state.query.date_received_min,
    to: state.query.date_received_max
  },
  interval: state.query.dateInterval,
  lens: state.query.lens,
  printMode: state.view.printMode,
  tooltip: state.trends.tooltip,
  width: state.view.width
} )

LineChart.propTypes = {
  title: PropTypes.string.isRequired
}

export default connect( mapStateToProps, mapDispatchToProps )( LineChart )
