import './BrushChart.less'
import * as d3 from 'd3'
import { brush } from 'britecharts'
import { changeDates } from '../../actions/filter'
import { connect } from 'react-redux'
import moment from 'moment'
import React from 'react'

export class BrushChart extends React.Component {
  constructor( props ) {
    super( props )

    // This binding is necessary to make `this` work in the callback
    // https://facebook.github.io/react/docs/handling-events.html
    this._brushEnd = this._brushEnd.bind( this )
  }

  componentDidMount() {
    this._redrawChart()
  }

  componentDidUpdate( prevProps ) {
    if ( JSON.stringify( this.props ) !== JSON.stringify( prevProps ) ) {
      this._redrawChart()
    }
  }

  _brushEnd( brushExtent ) {
    let from = moment( brushExtent[0], '%m/%d/%Y' )
    let through = moment( brushExtent[1], '%m/%d/%Y' )
    d3.select( '.js-start-date' ).text( from )
    d3.select( '.js-end-date' ).text( through )
    d3.select( '.js-date-range' ).classed( 'is-hidden', false )
    d3.select( 'rect.handle.handle--e, rect.handle.handle--w' )
      .attr( 'y', '1' )
    from = moment( from, 'MM-DD-YYYY' )
    through = moment( through, 'MM-DD-YYYY' )

    this.props.changeDates( from, through )
  }

  _redrawChart() {
    // early exit if no data
    const brushDateData = this.props.brushDateData
    if ( !brushDateData || !brushDateData.length ) {
      return
    }

    const chartID = '#brush-chart'
    const container = d3.select( chartID )
    d3.select( chartID + ' .brush-chart' ).remove()
    const containerWidth = container.node().getBoundingClientRect().width
    const brushChart = brush()

    brushChart.margin( {
      left: 30,
      right: 10,
      top: 10,
      bottom: 40
    } )
      .width( containerWidth )
      .height( 70 )
      .on( 'customBrushEnd', this._brushEnd )

    container.datum( brushDateData ).call( brushChart )
    brushChart.dateRange( this.props.dateRange )
  }

  render() {
    return (
      <div id="brush-chart">
      </div>
    )
  }
}

export const mapStateToProps = state => ( {
  brushDateData: state.trends.results.dateRangeBrush,
  dateRange: [ state.query.date_received_min, state.query.date_received_max ],
  width: state.view.width
} )

export const mapDispatchToProps = dispatch => ( {
  changeDates: ( from, through ) => {
    dispatch( changeDates( 'date_received', from, through ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( BrushChart )
