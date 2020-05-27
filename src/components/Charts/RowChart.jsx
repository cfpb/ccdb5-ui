/* eslint complexity: ["error", 5] */

import './RowChart.less'
import * as d3 from 'd3'
import { hashObject, slugify } from '../../utils'
import { miniTooltip, row } from 'britecharts'
import Analytics from '../../actions/analytics'
import { connect } from 'react-redux'
import { max } from 'd3-array'
import React from 'react'
import { toggleTrend } from '../../actions/trends'

export class RowChart extends React.Component {
  constructor( props ) {
    super( props )
    this.aggtype = props.aggtype
  }

  _getHeight( numRows ) {
    return numRows === 1 ? 100 : numRows * 60
  }

  _wrapText( text, width ) {
    // ignore test coverage since this is code borrowed from d3 mbostock
    // text wrapping functions
    /* istanbul ignore next */
    // eslint-disable-next-line complexity
    text.each( function() {
      const innerText = d3.select( this )
      if ( innerText.node().children && innerText.node().children.length > 0 ) {
        // assuming its already split up
        return
      }
      const words = innerText.text().split( /\s+/ ).reverse(),
            // ems
            lineHeight = 1.1,
            y = innerText.attr( 'y' ) || 0,
            dy = parseFloat( innerText.attr( 'dy' ) || 0 )

      let word,
          line = [],
          lineNumber = 0,
          tspan = innerText.text( null ).append( 'tspan' ).attr( 'x', 0 )
            .attr( 'y', y ).attr( 'dy', dy + 'em' )

      // eslint-disable-next-line no-cond-assign
      while ( word = words.pop() ) {
        line.push( word )
        tspan.text( line.join( ' ' ) )
        if ( tspan.node().getComputedTextLength() > width ) {
          line.pop()
          tspan.text( line.join( ' ' ) )
          line = [ word ]
          tspan = innerText.append( 'tspan' )
            .attr( 'x', 0 )
            .attr( 'y', y )
            // eslint-disable-next-line no-mixed-operators
            .attr( 'dy', ++lineNumber * lineHeight + dy + 'em' )
            .text( word )
        }
      }
    } )
  }


  componentDidUpdate( prevProps ) {
    const props = this.props
    if( hashObject( prevProps ) !== hashObject( props ) ) {
      this._redrawChart()
    }
  }
  // --------------------------------------------------------------------------
  // Event Handlers
  // eslint-disable-next-line complexity
  _redrawChart() {
    const componentProps = this.props
    const { colorMap, data, lens, printMode, tab } = componentProps
    if ( !data || !data.length ) {
      return
    }

    const tooltip = miniTooltip()
    tooltip.valueFormatter( value => value.toLocaleString() + ' complaints' )

    const rowData = data
    const total = this.props.total
    const ratio = total / max( rowData, o => o.value )
    // console.log( rowData )
    // console.log( total, max( rowData, o => o.value ), ratio )

    const chartID = '#row-chart-' + this.aggtype
    d3.select( chartID + ' .row-chart' ).remove()
    const rowContainer = d3.select( chartID )
    const width = printMode ? 750 :
      rowContainer.node().getBoundingClientRect().width
    const height = this._getHeight( rowData.length )
    const chart = row()
    const marginLeft = width / 3

    // tweak to make the chart full width at desktop
    // add space at narrow width
    const marginRight = width < 600 ? 20 : -80
    // console.log(colorMap)
    const colorScheme = rowData
      .map( o => {
        if ( lens === 'Overview' || tab === 'map' ) {
          return '#20aa3f'
        }
        // console.log( o.name, o.parent, colorMap[o.name] )
        // bad data. Credit Reporting appears twice in the product data
        const name = o.name ? o.name.trim() : ''
        const parent = o.parent ? o.parent.trim() : ''
        // parent should have priority
        return colorMap[parent] ? colorMap[parent] : colorMap[name]
      } )

    // console.log( colorScheme )

    chart.margin( {
      left: marginLeft,
      right: marginRight,
      // left: 200,
      // right: 50,
      top: 20,
      bottom: 10
    } )
      .colorSchema( colorScheme )
      .backgroundColor( '#f7f8f9' )
      // .enableYAxisRight(true) // for trends to show deltas
      .enableLabels( true )
      .labelsTotalCount( total.toLocaleString() )
      .labelsNumberFormat( ',d' )
      .outerPadding( 0.1 )
      .percentageAxisToMaxRatio( ratio )
      .yAxisLineWrapLimit( 2 )
      .yAxisPaddingBetweenChart( 20 )
      .width( width )
      .wrapLabels( true )
      .height( height )
      .on( 'customMouseOver', tooltip.show )
      .on( 'customMouseMove', tooltip.update )
      .on( 'customMouseOut', tooltip.hide )

    rowContainer.datum( rowData ).call( chart )
    const tooltipContainer = d3.selectAll( chartID + ' .row-chart .metadata-group' )
    tooltipContainer.datum( [] ).call( tooltip );
    this._wrapText( d3.select( chartID ).selectAll( '.tick text' ), marginLeft )

    rowContainer.selectAll( '.y-axis-group .tick' )
      .on( 'click', this.props.toggleRow )
  }

  render() {
    return (
      <div className="row-chart-section">
        <h3>{ this.props.title }</h3>
        <div id={ 'row-chart-' + this.aggtype }>
        </div>
      </div>
    )
  }
}

export const mapDispatchToProps = dispatch => ( {
  toggleRow: selectedState => {
    // Analytics.sendEvent(
    //   Analytics.getDataLayerOptions( 'Trend Event: add',
    //     selectedState.abbr, )
    // )
    dispatch( toggleTrend( selectedState ) )
  }
} )

export const mapStateToProps = ( state, ownProps ) => {
  const { printMode, width } = state.view
  // use state.query to filter out the selected bars
  const aggtype = ownProps.aggtype.toLowerCase()
  const tab = state.query.tab.toLowerCase()
  const colorMap = tab === 'trends' ? state.trends.colorMap : {}
  const filters = state.query[aggtype]
  let data = state[tab] && state[tab].results[aggtype] ?
    state[tab].results[aggtype] : []
  if ( filters && filters.length ) {
    data = data.filter( o => {
      if ( o.parent ) {
        return filters.includes( slugify( o.parent, o.name ) )
      }

      return filters.includes( o.name )
    } )
  }

  data = data.filter( o => o.visible )

  return {
    colorMap,
    data,
    lens: state.query.lens,
    printMode,
    tab,
    total: state.aggs.total,
    width
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( RowChart )
