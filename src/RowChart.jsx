import './RowChart.less';
import * as d3 from 'd3';
import { connect } from 'react-redux';
import { max } from 'd3-array';
import React from 'react';
import { row } from 'britecharts';

export class RowChart extends React.Component {
  constructor( props ) {
    super( props );
    this.aggtype = props.aggtype;
  }

  _getHeight( numRows ) {
    return numRows === 1 ? 100 : numRows * 60;
  }

  _wrapText( text, width ) {
    // eslint-disable-next-line complexity
    text.each( function() {
      const innerText = d3.select( this );
      if ( innerText.node().children.length > 0 ) {
        // assuming its already split up
        return;
      }
      const words = innerText.text().split( /\s+/ ).reverse(),
            // ems
            lineHeight = 1.1,
            y = innerText.attr( 'y' ) || 0,
            dy = parseFloat( innerText.attr( 'dy' ) || 0 );

      let word,
          line = [],
          lineNumber = 0,
          tspan = innerText.text( null ).append( 'tspan' ).attr( 'x', 0 )
            .attr( 'y', y ).attr( 'dy', dy + 'em' );

      // eslint-disable-next-line no-cond-assign
      while ( word = words.pop() ) {
        line.push( word );
        tspan.text( line.join( ' ' ) );
        if ( tspan.node().getComputedTextLength() > width ) {
          line.pop();
          tspan.text( line.join( ' ' ) );
          line = [ word ];
          tspan = innerText.append( 'tspan' )
            .attr( 'x', 0 )
            .attr( 'y', y )
            // eslint-disable-next-line no-mixed-operators
            .attr( 'dy', ++lineNumber * lineHeight + dy + 'em' )
            .text( word );
        }
      }
    } );
  }

  componentDidUpdate() {
    const data = this.props.data.slice( 0, 5 );
    const total = this.props.total;
    const ratio = total / max( data, o => o.value );
    const chartID = '#rowchart-' + this.aggtype;
    d3.select( chartID + ' .row-chart' ).remove();
    const rowContainer = d3.select( chartID );
    const width = rowContainer.node().getBoundingClientRect().width;
    const height = this._getHeight( data.length );
    const chart = row();
    const marginLeft = width / 3;
    chart.margin( {
      left: marginLeft,
      right: 0,
      top: 20,
      bottom: 10
    } )
      .backgroundColor( '#f7f8f9' )
      .enableLabels( true )
      .labelsSize( 14 )
      // .labelsSizeChild( 12 )
      .labelsTotalCount( total.toLocaleString() )
      .labelsNumberFormat( ',d' )
      .outerPadding( 0.1 )
      .percentageAxisToMaxRatio( ratio )
      .yAxisLineWrapLimit( 1 )
      .yAxisPaddingBetweenChart( 5 )
      .width( width )
      .wrapLabels( false )
      .height( height );
    rowContainer.datum( data ).call( chart );

    this._wrapText(
      d3.select( chartID ).selectAll( '.tick text' ),
      marginLeft
    );
  }

  render() {
    return (
      <div>
        <h3>{ this.aggtype } by complaint volume (5 highest counts)</h3>
        <div id={ 'rowchart-' + this.aggtype }>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // Helper methods

  // --------------------------------------------------------------------------
  // Subrender methods
}

const mapStateToProps = ( state, ownProps ) => {
  // use state.query to rip filter out the bars
  const aggtype = ownProps.aggtype;
  const filters = state.query[aggtype];
  let data = state.map[aggtype];

  if ( filters && filters.length ) {
    data = data.filter( o => filters.includes( o.name ) );
  }
  return {
    data,
    total: state.results.total
  };
};

export default connect( mapStateToProps )( RowChart );

