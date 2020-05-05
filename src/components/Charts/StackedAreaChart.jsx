import './StackedAreaChart.less'
import * as d3 from 'd3'
import { connect } from 'react-redux'
import { getLastDate } from '../../utils/chart'
import React from 'react'
import { stackedArea } from 'britecharts'
import { trendsTooltipChanged } from '../../actions/trends'

export class StackedAreaChart extends React.Component {
  componentDidUpdate() {
    this._redrawChart()
  }

  _tipStuff( evt ) {
    if ( this.props.tooltip.date !== evt.key ) {
      this.props.tooltipUpdated( {
        date: evt.key,
        dateRange: {
          from: '',
          to: ''
        },
        interval: this.props.interval,
        values: evt.values
      } )
    }
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
    const colors = Object.values( this.props.colorMap )

    stackedAreaChart.margin( { left:50, right: 10, top: 10, bottom: 40 } )
      .areaCurve( 'linear' )
      .initializeVerticalMarker( true )
      .isAnimated( false )
      .tooltipThreshold( 1 )
      .grid( 'horizontal' )
      .aspectRatio( 0.5 )
      .width( containerWidth )
      .dateLabel( 'date' )
      .colorSchema( colors )
      // .on( 'customMouseOver', function ( evt ) {
      //   console.log( 'I was mouseover' )
      //   console.log( evt )
      // } )
      .on( 'customMouseMove', this._tipStuff.bind( this ) )

      //   function ( evt ) {
      //   console.log( 'Moved, update tt' )
      //   tipchanged( evt )
      //   console.log( evt )
      // } )
      // .on( 'customMouseOut', function ( evt ) {
      //   console.log( 'I was mouseout' )
      //   console.log( evt )
      // });

    container.datum( this.props.data ).call( stackedAreaChart )
    if ( this.props.tooltip === false ) {
      const config = {
        dateRange: {
          from: '',
          to: ''
        },
        interval: this.props.interval
      }
      this.props.tooltipUpdated( getLastDate( this.props.data, config ) )
    }
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
    dispatch( trendsTooltipChanged( selectedState ) )
  }
} )

export const mapStateToProps = state => ( {
  colorMap: state.trends.colorMap,
  data: state.trends.results.dateRangeArea,
  lens: state.trends.lens,
  interval: state.query.dateInterval,
  tooltip: state.trends.tooltip
} )

export default connect( mapStateToProps,
  mapDispatchToProps )( StackedAreaChart )
