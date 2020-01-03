import { connect } from 'react-redux';
import { line } from 'britecharts';
import React from 'react';
import { select } from 'd3-selection';

export class LineChart extends React.Component {
  componentDidUpdate() {
    const lineContainer = select( '#line-chart' );
    const lineChart = line();

    lineChart.margin( { left: 30, right: 10, top: 10, bottom: 40 } )
      .initializeVerticalMarker( true )
      .isAnimated( true )
      .tooltipThreshold( 1 )
      .grid( 'horizontal' )
      .aspectRatio( 0.75 )
      .width( 600 )
      .dateLabel( 'date' );

    lineContainer.datum( this.props.data ).call( lineChart );
  }


  render() {
    return (
      <div>
        <div id="line-chart">
        </div>
      </div>
    );
  }
}

// tbd: addin correct reducer here
const mapStateToProps = state => ( { data: state.map.trends } );

export default connect( mapStateToProps )( LineChart );

