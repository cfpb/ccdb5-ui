/* eslint complexity: ["error", 6] */
import './LineChart.less'
import * as d3 from 'd3'

import { getLastLineDate, getTooltipTitle } from '../../utils/chart'
import { line, tooltip } from 'britecharts'
import { connect } from 'react-redux'
import { hashObject } from '../../utils'
import { isDateEqual } from '../../utils/formatDate'
import React from 'react'
import { updateTrendsTooltip } from '../../actions/trends'

export class LineChart extends React.Component {
  tip = null
  constructor( props ) {
    super( props )
    this._updateTooltip = this._updateTooltip.bind( this )
    this._updateInternalTooltip = this._updateInternalTooltip.bind( this )
  }

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

  _updateTooltip( point ) {
    if ( !isDateEqual( this.props.tooltip.date, point.date ) ) {
      this.props.tooltipUpdated( {
        date: point.date,
        dateRange: this.props.dateRange,
        interval: this.props.interval,
        values: point.topics
      } )
    }
  }

  _updateInternalTooltip( dataPoint, topicColorMap, dataPointXPosition ) {
    const { dateRange, interval } = this.props
    this.tip.title( getTooltipTitle( dataPoint.date, interval, dateRange,
      false ) )
    this.tip.update( dataPoint, topicColorMap, dataPointXPosition )
  }

  _chartWidth( chartID ) {
    const {
      lens, printMode
    } = this.props
    if ( printMode ) {
      return lens === 'Overview' ? 750 : 540
    }
    const container = d3.select( chartID )
    return container.node().getBoundingClientRect().width
  }

  _redrawChart() {
    const {
      colorMap, data, dateRange, interval, lastDate, lens
    } = this.props
    if ( !data.dataByTopic || !data.dataByTopic.length ) {
      return
    }

    const chartID = '#line-chart'
    const container = d3.select( chartID )
    const width = this._chartWidth( chartID )
    d3.select( chartID + ' .line-chart' ).remove()
    const lineChart = line()
    this.tip = tooltip()
      .shouldShowDateInTitle( false )
      .topicLabel( 'topics' )
      .title( 'Complaints' )

    const tip = this.tip
    const colorScheme = data.dataByTopic
      .map( o => colorMap[o.topic] )

    lineChart.margin( { left: 60, right: 10, top: 10, bottom: 40 } )
      .initializeVerticalMarker( true )
      .isAnimated( true )
      .tooltipThreshold( 1 )
      .grid( 'horizontal' )
      .aspectRatio( 0.5 )
      .width( width )
      .dateLabel( 'date' )
      .colorSchema( colorScheme )

    if ( lens === 'Overview' ) {
      lineChart
        .on( 'customMouseOver', tip.show )
        .on( 'customMouseMove', this._updateInternalTooltip )
        .on( 'customMouseOut', tip.hide )
    } else {
      lineChart.on( 'customMouseMove', this._updateTooltip )
    }

    container.datum( data ).call( lineChart )
    const tooltipContainer =
      d3.select( chartID + ' .metadata-group .vertical-marker-container' )
    tooltipContainer.datum( [] ).call( tip )

    const config = {
      dateRange,
      interval,
      lastDate
    }

    if ( lens !== 'Overview' ) {
      // get the last date and fire it off to redux
      this.props.tooltipUpdated( getLastLineDate( data, config ) )
    }
  }

  render() {
    return (
      <div className={'chart-wrapper'}>
        <p className={ 'y-axis-label' }>Complaints</p>
        <div id="line-chart">
        </div>
        <p className={ 'x-axis-label' }>Date received by the CFPB</p>
      </div>
    )
  }
}

export const mapDispatchToProps = dispatch => ( {
  tooltipUpdated: tipEvent => {
    // Analytics.sendEvent(
    //   Analytics.getDataLayerOptions( 'Trend Event: add',
    //     selectedState.abbr, )
    // )
    dispatch( updateTrendsTooltip( tipEvent ) )
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
  lastDate: state.trends.lastDate,
  lens: state.query.lens,
  printMode: state.view.printMode,
  tooltip: state.trends.tooltip,
  width: state.view.width
} )

export default connect( mapStateToProps, mapDispatchToProps )( LineChart )
