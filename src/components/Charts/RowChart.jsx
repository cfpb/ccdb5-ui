/* eslint complexity: ["error", 5] */

import './RowChart.less'
import * as d3 from 'd3'
import { changeFocus, collapseTrend, expandTrend } from '../../actions/trends'
import { coalesce, getAllFilters, hashObject } from '../../utils'
import { miniTooltip, row } from 'britecharts'
import { MODE_MAP, SLUG_SEPARATOR } from '../../constants'
import { addMultipleFilters } from '../../actions/filter'
import { connect } from 'react-redux'
import { max } from 'd3-array'
import PropTypes from 'prop-types'
import React from 'react'
import { scrollToFocus } from '../../utils/trends'

export class RowChart extends React.Component {
  constructor( props ) {
    super( props )
    this._selectFocus = this._selectFocus.bind( this )
    this._toggleRow = this._toggleRow.bind( this )
  }

  _formatTip( value ) {
    return value.toLocaleString() + ' complaints'
  }

  _getHeight( numRows ) {
    return numRows === 1 ? 100 : numRows * 60
  }

  _wrapText( text, width ) {
    // ignore test coverage since this is code borrowed from d3 mbostock
    // text wrapping functions

    /* eslint-disable complexity */
    /* istanbul ignore next */
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
    /* eslint-enable complexity */

  }

  componentDidMount() {
    this._redrawChart()
  }

  componentDidUpdate( prevProps ) {
    const props = this.props
    if ( hashObject( prevProps ) !== hashObject( props ) ) {
      this._redrawChart()
    }
  }

  // --------------------------------------------------------------------------
  // Event Handlers
  // eslint-disable-next-line complexity
  _redrawChart() {
    const {
      colorScheme, data, id, printMode, total
    } = this.props
    // deep copy
    // do this to prevent REDUX pollution
    const rows = JSON.parse( JSON.stringify( data ) ).filter( o => {
      if ( this.props.showTrends ) {
        return true
      }

      return o.name ? o.name.indexOf( 'More Information about' ) === -1 : true
    } )

    if ( !rows || !rows.length || !total ) {
      return
    }

    const tooltip = miniTooltip()
    tooltip.valueFormatter( this._formatTip )

    const ratio = total / max( rows, o => o.value )
    const chartID = '#row-chart-' + id
    d3.selectAll( chartID + ' .row-chart' ).remove()
    const rowContainer = d3.select( chartID )
    const width = printMode ? 750 :
      rowContainer.node().getBoundingClientRect().width
    const height = this._getHeight( rows.length )
    const chart = row()
    const marginLeft = width / 4

    // tweak to make the chart full width at desktop
    // add space at narrow width
    const marginRight = width < 600 ? 20 : -80
    chart.margin( {
      left: marginLeft,
      right: marginRight,
      top: 20,
      bottom: 10
    } )
      .colorSchema( colorScheme )
      .backgroundColor( '#f7f8f9' )
      .paddingBetweenGroups( 25 )
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
    const tooltipContainer =
      d3.selectAll( chartID + ' .row-chart .metadata-group' )
    tooltipContainer.datum( [] ).call( tooltip )
    this._wrapText( d3.select( chartID ).selectAll( '.tick text' ), marginLeft )

    this._wrapText( d3.select( chartID )
      .selectAll( '.view-more-label' ), width / 2 )

    rowContainer
      .selectAll( '.y-axis-group .tick' )
      .on( 'click', this._toggleRow )

    rowContainer
      .selectAll( '.view-more-label' )
      .on( 'click', this._selectFocus )

  }

  _selectFocus( element ) {
    // make sure to assign a valid lens when a row is clicked
    const lens = this.props.lens === 'Overview' ? 'Product' : this.props.lens
    const filters = coalesce( this.props.aggs, lens.toLowerCase(), [] )
    this.props.selectFocus( element, lens, filters )
  }

  _toggleRow( rowName ) {
    // fire off different action depending on if the row is expanded or not
    const { expandableRows, expandedTrends } = this.props
    if ( expandableRows.includes( rowName ) ) {
      if ( expandedTrends.includes( rowName ) ) {
        this.props.collapseRow( rowName )
      } else {
        this.props.expandRow( rowName )
      }
    }
  }


  render() {
    return (
      this.props.total > 0 &&
      <div className="row-chart-section">
        <h3>{ this.props.title }</h3>
        <p>{ this.props.helperText }</p>
        <div id={ 'row-chart-' + this.props.id }>
        </div>
      </div>
    )
  }
}

export const mapDispatchToProps = dispatch => ( {
  selectFocus: ( element, lens, filters ) => {
    scrollToFocus()
    console.log( filters )
    // const selectedFilters = filters.filter( o => o === element.parent || o.indexOf( element.parent + SLUG_SEPARATOR ) )
    const filterGroup = filters.find(o => o.key === element.parent )
    // console.log( filterGroup['sub_' + lens.toLowerCase() + '.raw'] )
    console.log(filterGroup)
    const values = filterGroup ? getAllFilters( element.parent, filterGroup['sub_' + lens.toLowerCase() + '.raw'].buckets ) : []
    console.log( values )
    if(values.length) {
      dispatch( addMultipleFilters( lens, [ ...values ] ) )
    }
    dispatch( changeFocus( element.parent, lens, [ ...values ]) )
  },
  collapseRow: rowName => {
    dispatch( collapseTrend( rowName.trim() ) )
  },
  expandRow: rowName => {
    dispatch( expandTrend( rowName.trim() ) )
  }
} )

export const mapStateToProps = state => {
  const { tab } = state.query
  const lens = tab === MODE_MAP ? 'Product' : state.query.lens
  const { aggs } = state
  const { expandableRows, expandedTrends } = state[tab.toLowerCase()]
  const { printMode, showTrends, width } = state.view
  return {
    aggs,
    expandableRows,
    expandedTrends,
    lens,
    printMode,
    showTrends,
    tab,
    width
  }
}

RowChart.propTypes = {
  id: PropTypes.string.isRequired,
  colorScheme: PropTypes.oneOfType( [
    PropTypes.array,
    PropTypes.bool
  ] ).isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired
}

export default connect( mapStateToProps, mapDispatchToProps )( RowChart )
