/* eslint complexity: ["error", 5] */

import './RowChart.less';
import * as d3 from 'd3';
import {
  cloneDeep,
  coalesce,
  getAllFilters,
  hashObject,
  sendAnalyticsEvent
} from '../../utils';
import { collapseRow, expandRow } from '../../actions/view';
import { miniTooltip, row } from 'britecharts';
import { changeFocus } from '../../actions/trends';
import { connect } from 'react-redux';
import { max } from 'd3-array';
import { MODE_MAP } from '../../constants';
import PropTypes from 'prop-types';
import React from 'react';
import { scrollToFocus } from '../../utils/trends';

export class RowChart extends React.Component {
  constructor( props ) {
    super( props );
    this._selectFocus = this._selectFocus.bind( this );
    this._toggleRow = this._toggleRow.bind( this );
  }

  _formatTip( value ) {
    return value.toLocaleString() + ' complaints';
  }

  _getHeight( numRows ) {
    return numRows === 1 ? 100 : numRows * 60;
  }

  _wrapText( text, width, viewMore ) {
    // ignore test coverage since this is code borrowed from d3 mbostock
    // text wrapping functions
    /* eslint-disable complexity */
    /* istanbul ignore next */
    text.each( function() {
      const innerText = d3.select( this );
      const spanWidth = viewMore ? innerText.attr( 'x' ) : 0;
      if ( innerText.node().children && innerText.node().children.length > 0 ) {
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
          wrapCount = 0,
          tspan = innerText
          .text( null )
          .append( 'tspan' )
          .attr( 'x', spanWidth )
          .attr( 'y', y )
          .attr( 'dy', dy + 'em' );

      // eslint-disable-next-line no-cond-assign
      while ( word = words.pop() ) {
        line.push( word );
        tspan.text( line.join( ' ' ) );
        if ( tspan.node().getComputedTextLength() > width ) {
          line.pop();
          tspan.text( line.join( ' ' ) );
          line = [ word ];
          tspan = innerText
            .append( 'tspan' )
            .attr( 'x', spanWidth )
            .attr( 'y', y )
            // eslint-disable-next-line no-mixed-operators
            .attr( 'dy', ++lineNumber * lineHeight + dy + 'em' )
            .text( word );
          wrapCount++;
        }
      }

      // only allow this to go through if not IE
      if ( wrapCount && !window.document.documentMode ) {
        const viewMoreBackground = d3
          .select( innerText.node().parentNode )
          .select( '.view-more-background' );
        const oldHeight = viewMoreBackground.attr( 'height' );
        // eslint-disable-next-line no-mixed-operators
        const newHeight = parseFloat( oldHeight ) + wrapCount * 12;
        viewMoreBackground.attr( 'height', newHeight );
      }
    } );
    /* eslint-enable complexity */
  }

  componentDidMount() {
    this._redrawChart();
  }

  componentDidUpdate( prevProps ) {
    const props = this.props;
    if ( hashObject( prevProps ) !== hashObject( props ) ) {
      this._redrawChart();
    }
  }

  // --------------------------------------------------------------------------
  // Event Handlers
  // eslint-disable-next-line complexity
  _redrawChart() {
    const { colorScheme, data, id, isPrintMode, total } = this.props;
    // deep copy
    // do this to prevent REDUX pollution
    const rows = cloneDeep( data ).filter( o => {
      if ( o.name && isPrintMode ) {
        // remove spacer text if we are in print mode
        return o.name.indexOf( 'Visualize trends for' ) === -1;
      }
      return true;
    } );

    if ( !rows || !rows.length || !total ) {
      return;
    }

    const tooltip = miniTooltip();
    tooltip.valueFormatter( this._formatTip );

    const ratio = total / max( rows, o => o.value );
    const chartID = '#row-chart-' + id;
    d3.selectAll( chartID + ' .row-chart' ).remove();
    const rowContainer = d3.select( chartID );

    // added padding to make up for margin
    const width = isPrintMode ?
      750 :
      rowContainer.node().getBoundingClientRect().width + 30;

    const height = this._getHeight( rows.length );
    const chart = row();
    const marginLeft = width / 4;

    // tweak to make the chart full width at desktop
    // add space at narrow width
    const marginRight = width < 600 ? 40 : -65;
    chart
      .margin( {
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
      .on( 'customMouseOut', tooltip.hide );

    rowContainer.datum( rows ).call( chart );
    const tooltipContainer = d3.selectAll(
      chartID + ' .row-chart .metadata-group'
    );
    tooltipContainer.datum( [] ).call( tooltip );
    this._wrapText( d3.select( chartID ).selectAll( '.tick text' ), marginLeft );

    this._wrapText(
      d3.select( chartID ).selectAll( '.view-more-label' ),
      width / 2,
      true
    );

    rowContainer.selectAll( '.y-axis-group .tick' ).on( 'click', this._toggleRow );

    rowContainer.selectAll( '.view-more-label' ).on( 'click', this._selectFocus );
  }

  _selectFocus( element ) {
    // make sure to assign a valid lens when a row is clicked
    const lens = this.props.lens === 'Overview' ? 'Product' : this.props.lens;
    const filters = coalesce( this.props.aggs, lens.toLowerCase(), [] );
    this.props.selectFocus( element, lens, filters );
  }

  _toggleRow( rowName ) {
    // fire off different action depending on if the row is expanded or not
    const { data, expandedRows } = this.props;
    const expandableRows = data.filter( o => o.isParent ).map( o => o.name );

    if ( !expandableRows.includes( rowName ) ) {
      // early exit
      return;
    }

    if ( expandedRows.includes( rowName ) ) {
      this.props.collapseRow( rowName );
    } else {
      this.props.expandRow( rowName );
    }
  }

  render() {
    return (
      this.props.total > 0 &&
        <div className="row-chart-section">
          <h3>{this.props.title}</h3>
          <p>{this.props.helperText}</p>
          <div id={'row-chart-' + this.props.id}></div>
        </div>

    );
  }
}

export const mapDispatchToProps = dispatch => ( {
  selectFocus: ( element, lens, filters ) => {
    scrollToFocus();
    let values = [];
    if ( lens === 'Company' ) {
      values.push( element.parent );
    } else {
      const filterGroup = filters.find( o => o.key === element.parent );
      const keyName = 'sub_' + lens.toLowerCase() + '.raw';
      values = filterGroup ?
        getAllFilters( element.parent, filterGroup[keyName].buckets ) :
        [];
    }
    sendAnalyticsEvent( 'Trends click', element.parent );
    dispatch( changeFocus( element.parent, lens, [ ...values ] ) );
  },
  collapseRow: rowName => {
    sendAnalyticsEvent( 'Bar chart collapsed', rowName );
    dispatch( collapseRow( rowName ) );
  },
  expandRow: rowName => {
    sendAnalyticsEvent( 'Bar chart expanded', rowName );
    dispatch( expandRow( rowName ) );
  }
} );

export const mapStateToProps = state => {
  const { tab } = state.query;
  const lens = tab === MODE_MAP ? 'Product' : state.query.lens;
  const { aggs } = state;
  const { expandedRows, isPrintMode, width } = state.view;
  return {
    aggs,
    expandedRows,
    lens,
    isPrintMode,
    tab,
    width
  };
};

export default connect( mapStateToProps, mapDispatchToProps )( RowChart );

RowChart.propTypes = {
  id: PropTypes.string.isRequired,
  colorScheme: PropTypes.oneOfType( [ PropTypes.array, PropTypes.bool ] )
    .isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  isPrintMode: PropTypes.bool
};
