import './BrushChart.less'
import * as d3 from 'd3'
import { brush } from 'britecharts'
import { changeDates } from '../../actions/filter'
import { connect } from 'react-redux'
import moment from 'moment'
import React from 'react'

export class BrushChart extends React.Component {
  constructor( props ) {
    super( props );

    // This binding is necessary to make `this` work in the callback
    // https://facebook.github.io/react/docs/handling-events.html
    this._brushEnd = this._brushEnd.bind( this );
  }

  componentDidMount() {
    this._redrawChart()
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    console.log(this.props.dateRange)
    console.log(prevProps.dateRange)
    if ( JSON.stringify( this.props.dateRange ) !==
      JSON.stringify( prevProps.dateRange ) ) {
      this._redrawChart()
    }
  }

  _brushEnd( brushExtent ) {
    const format = d3.timeFormat( '%m/%d/%Y' );

    let from = brushExtent[0]
    let through = brushExtent[1]
    d3.select( '.js-start-date' ).text( format( from ) );
    d3.select( '.js-end-date' ).text( format( through ) );
    d3.select( '.js-date-range' ).classed( 'is-hidden', false );
    d3.select( 'rect.handle.handle--e, rect.handle.handle--w' )
      .attr( 'y', '1' );
    from = moment( from, 'MM-DD-YYYY' )
    through = moment( through, 'MM-DD-YYYY' )

    // let dateRange;

    // if ( !brushExtent[0] || !brushExtent[1] ) {
    //   dateRange = {
    //     from: defaultDateRange.min,
    //     to: defaultDateRange.max
    //   };
    // } else {
    //   dateRange = {
    //     from: formatDateModel( brushExtent[0] ),
    //     to: formatDateModel( brushExtent[1] )
    //   }
    // }
    this.props.changeDates( from, through )
  }
  _redrawChart() {
    const chartID = '#brush-chart'
    const container = d3.select( chartID )
    d3.select( chartID + ' .brush-chart' ).remove()
    const containerWidth =
      container.node() ?
        container.node().getBoundingClientRect().width :
        false;
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

    container.datum( this.props.brushDateData ).call( brushChart )
    brushChart.dateRange( this.props.dateRange )

  }

  _getDateRange() {
    // const dr = $scope.dateRange
    // const min = isDateGreater( defaultDateRange.min, dr.from ) ?
    //   defaultDateRange.min : dr.from
    //
    // const max = isDateGreater( defaultDateRange.max, dr.to ) ?
    //   dr.to : defaultDateRange.max

    // return [
    //   this.props,
    // ]
  }

  render() {
    return (
      <div id="brush-chart">
      </div>
    )
  }
}

export const mapStateToProps = state => ( {
  brushDateData: [
    { date: '2015-06-27T07:00:00.000Z', value: 4 },
    { date: '2015-06-28T07:00:00.000Z', value: 12 },
    { date: '2015-06-29T07:00:00.000Z', value: 33 },
    { date: '2015-06-30T07:00:00.000Z', value: 17 },
    { date: '2015-07-01T07:00:00.000Z', value: 17 },
    { date: '2015-07-02T07:00:00.000Z', value: 16 },
    { date: '2015-07-03T07:00:00.000Z', value: 8 },
    { date: '2015-07-04T07:00:00.000Z', value: 14 },
    { date: '2015-07-05T07:00:00.000Z', value: 11 },
    { date: '2015-07-06T07:00:00.000Z', value: 14 },
    { date: '2015-07-07T07:00:00.000Z', value: 25 },
    { date: '2015-07-08T07:00:00.000Z', value: 55 },
    { date: '2015-07-09T07:00:00.000Z', value: 15 },
    { date: '2015-07-10T07:00:00.000Z', value: 26 },
    { date: '2015-07-11T07:00:00.000Z', value: 21 },
    { date: '2015-07-12T07:00:00.000Z', value: 16 },
    { date: '2015-07-13T07:00:00.000Z', value: 20 },
    { date: '2015-07-14T07:00:00.000Z', value: 26 },
    { date: '2015-07-15T07:00:00.000Z', value: 24 },
    { date: '2015-07-16T07:00:00.000Z', value: 29 },
    { date: '2015-07-17T07:00:00.000Z', value: 12 },
    { date: '2015-07-18T07:00:00.000Z', value: 16 },
    { date: '2015-07-19T07:00:00.000Z', value: 11 },
    { date: '2015-07-20T07:00:00.000Z', value: 29 },
    { date: '2015-07-21T07:00:00.000Z', value: 9 },
    { date: '2015-07-22T07:00:00.000Z', value: 26 },
    { date: '2015-07-23T07:00:00.000Z', value: 21 },
    { date: '2015-07-24T07:00:00.000Z', value: 18 },
    { date: '2015-07-25T07:00:00.000Z', value: 15 },
    { date: '2015-07-26T07:00:00.000Z', value: 23 },
    { date: '2015-07-27T07:00:00.000Z', value: 43 },
    { date: '2015-07-28T07:00:00.000Z', value: 44 },
    { date: '2015-07-29T07:00:00.000Z', value: 67 },
    { date: '2015-07-30T07:00:00.000Z', value: 67 },
    { date: '2015-07-31T07:00:00.000Z', value: 0 },
    { date: '2015-08-01T07:00:00.000Z', value: 0 },
    { date: '2015-08-02T07:00:00.000Z', value: 0 }
  ],
  dateRange: [ state.query.date_received_min, state.query.date_received_max ]
} )

export const mapDispatchToProps = dispatch => ( {
  changeDates: ( from, through ) => {
    dispatch( changeDates( 'date_received', from, through ) )
  }
} );

export default connect( mapStateToProps, mapDispatchToProps )( BrushChart )
