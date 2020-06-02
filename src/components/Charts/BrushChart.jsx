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
    const format = d3.timeFormat( '%m/%d/%Y' )

    let from = brushExtent[0]
    let through = brushExtent[1]
    d3.select( '.js-start-date' ).text( format( from ) )
    d3.select( '.js-end-date' ).text( format( through ) )
    d3.select( '.js-date-range' ).classed( 'is-hidden', false )
    d3.select( 'rect.handle.handle--e, rect.handle.handle--w' )
      .attr( 'y', '1' )
    from = moment( from, 'MM-DD-YYYY' )
    through = moment( through, 'MM-DD-YYYY' )

    this.props.changeDates( from, through )
  }

  _redrawChart() {
    // early exit if no data
    if ( !this.props.brushDateData || this.props.brushDateData.length ) {
      return
    }

    const chartID = '#brush-chart'
    const container = d3.select( chartID )
    d3.select( chartID + ' .brush-chart' ).remove()
    const containerWidth =
      container.node() ?
        container.node().getBoundingClientRect().width :
        false
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

    if ( this.props.brushDateData.length ) {
      // console.log( this.props.brushDateData )
      container.datum( this.props.brushDateData ).call( brushChart )
      brushChart.dateRange( this.props.dateRange )
    }
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
