/* eslint complexity: ["error", 5] */

import './RowChart.less'
import * as d3 from 'd3'
import { miniTooltip, row } from 'britecharts'
import { connect } from 'react-redux'
import { hashObject } from '../../utils'
import { max } from 'd3-array'
import PropTypes from 'prop-types'
import React from 'react'
import { toggleTrend } from '../../actions/trends'

export class RowChart extends React.Component {
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
    const { colorScheme, data, id, printMode, toggleRow, total } = this.props
    if ( !data || !data.length ) {
      return
    }

    const tooltip = miniTooltip()
    tooltip.valueFormatter( value => value.toLocaleString() + ' complaints' )

    const rows = data
    const ratio = total / max( rows, o => o.value )
    const chartID = '#row-chart-' + id
    d3.selectAll( chartID + ' .row-chart' ).remove()
    const rowContainer = d3.select( chartID )
    const width = printMode ? 750 :
      rowContainer.node().getBoundingClientRect().width
    const height = this._getHeight( rows.length )
    const chart = row()
    const marginLeft = width / 3

    // tweak to make the chart full width at desktop
    // add space at narrow width
    const marginRight = width < 600 ? 20 : -80
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

    rowContainer.datum( rows ).call( chart )
    const tooltipContainer = d3.selectAll( chartID + ' .row-chart .metadata-group' )
    tooltipContainer.datum( [] ).call( tooltip );
    this._wrapText( d3.select( chartID ).selectAll( '.tick text' ), marginLeft )

    rowContainer
      .selectAll( '.y-axis-group .tick' )
      .on( 'click', toggleRow )
  }

  render() {
    return (
      <div className="row-chart-section">
        <h3>{ this.props.title }</h3>
        <div id={ 'row-chart-' + this.props.id }>
        </div>
      </div>
    )
  }
}

export const mapDispatchToProps = dispatch => ( {
  toggleRow: selectedState => {
    dispatch( toggleTrend( selectedState ) )
  }
} )

export const mapStateToProps = ( state, ownProps ) => {
  const { printMode, width } = state.view
  return {
    printMode,
    total: state.aggs.total,
    width
  }
}

RowChart.propTypes = {
  id: PropTypes.string.isRequired,
  colorScheme: PropTypes.oneOfType( [
    PropTypes.array,
    PropTypes.bool
  ] ).isRequired,
  data: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
}

export default connect( mapStateToProps, mapDispatchToProps )( RowChart )
