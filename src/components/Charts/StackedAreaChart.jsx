import './StackedAreaChart.less'
import * as colors from '../../constants/colors'
import * as d3 from 'd3'
import { connect } from 'react-redux'
import { getLastDate } from '../../utils/chart'
import { hashObject } from '../../utils'
import { isDateEqual } from '../../utils/formatDate'
import PropTypes from 'prop-types'
import React from 'react'
import { stackedArea } from 'britecharts'
import { updateTrendsTooltip } from '../../actions/trends'


export class StackedAreaChart extends React.Component {
  constructor( props ) {
    super( props )
    this._updateTooltip = this._updateTooltip.bind( this )
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
        values: point.values
      } )
    }
  }

  _redrawChart() {
    const { colorMap, data, dateRange, interval, lastDate } = this.props
    if ( !data || !data.length ) {
      return
    }

    const chartID = '#stacked-area-chart'
    const container = d3.select( chartID )
    const containerWidth = container.node().getBoundingClientRect().width
    d3.select( chartID + ' .stacked-area' ).remove()
    const stackedAreaChart = stackedArea()
    const colorScheme = [ ...new Set( data.map( item => item.name ) ) ]
      .filter( o => o !== 'Other' )
      .map( o => colorMap[o] )
    colorScheme.push( colors.DataLens[10] )

    stackedAreaChart.margin( { left: 50, right: 10, top: 10, bottom: 40 } )
      .areaCurve( 'linear' )
      .initializeVerticalMarker( true )
      .isAnimated( false )
      .tooltipThreshold( 1 )
      .grid( 'horizontal' )
      .aspectRatio( 0.5 )
      .width( containerWidth )
      .dateLabel( 'date' )
      .colorSchema( colorScheme )
      .on( 'customMouseMove', this._updateTooltip )

    container.datum( data ).call( stackedAreaChart )

    const config = {
      dateRange,
      interval,
      lastDate
    }

    this.props.tooltipUpdated( getLastDate( data, config ) )
  }

  render() {
    return (
      <div>
        <h2>{ this.props.title }</h2>
        <div id="stacked-area-chart">
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
  data: state.trends.results.dateRangeArea,
  dateRange:  {
    from: state.query.date_received_min,
    to: state.query.date_received_max
  },
  interval: state.query.dateInterval,
  lastDate: state.trends.lastDate,
  lens: state.trends.lens,
  printMode: state.view.printMode,
  tooltip: state.trends.tooltip,
  width: state.view.width
} )

StackedAreaChart.propTypes = {
  title: PropTypes.string.isRequired
}

export default connect( mapStateToProps,
  mapDispatchToProps )( StackedAreaChart )
