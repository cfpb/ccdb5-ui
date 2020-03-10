// import TileMap from 'cfpb-chart-builder/src/js/charts/TileMap';

import accessibility from 'highcharts/modules/accessibility';
import Highcharts from 'highcharts/highmaps';
import { STATE_TILES } from './constants'

const TEN_K = 10000
const HUN_K = 100000
const MILLION = 1000000

/* ----------------------------------------------------------------------------
   Utility Functions */
/**
* A reducer function to process the maximum value in the state complaint data
*
* @param {number} accum the current max value
* @param {Object} stateComplaint a candidate value
* @returns {string} the maximum between the current and a state entry
*/
export function findMaxComplaints( accum, stateComplaint ) {
  return Math.max( accum, stateComplaint.displayValue );
}

/**
* Creates a shorter version of a number. 1,234 => 1.2K
*
* @param {Number} value the raw value
* @returns {string} A string representing a shortened value
*/
export function makeShortName( value ) {
  if ( value < 1000 ) {
    return value.toLocaleString();
  } else if ( value < TEN_K ) {
    return ( Math.floor( value / 100 ) / 10 ).toFixed( 1 ) + 'K'
  } else if ( value < MILLION ) {
    return Math.floor( value / 1000 ) + 'K'
  }

  return ( Math.floor( value / HUN_K ) / 10 ).toFixed( 1 ) + 'M'
}

/**
 * helper function to get the bins for legend and colors, etc.
 * @param {Array} data all of the states w/ displayValue, complaintCount, raw
 * @param {Array} colors an array of colors
 * @returns {Array} the bins with bounds, name, and color
 */
export function getBins( data, colors ) {
  const binCount = colors.length;
  const max = data.reduce( findMaxComplaints, 0 );
  const min = 1;

  // Early exit
  if ( max === 0 ) return [];

  const step = ( max - min + 1 ) / binCount;
  const bins = [
    { from: 0, to: min, color: '#fff', name: 'N/A', shortName: 'N/A' }
  ];

  for ( let i = 0, curr = min; i < binCount; i++, curr += step ) {
    const minValue = Math.round( curr );
    const displayValue = minValue.toLocaleString();
    const shortened = makeShortName( minValue )

    bins.push( {
      from: minValue,
      to: Math.round( curr + step ),
      color: colors[i],
      name: `≥ ${ displayValue }`,
      shortName: `≥ ${ shortened }`
    } );
  }

  // The last bin is unbounded
  // eslint-disable-next-line no-undefined
  bins[bins.length - 1].to = undefined;

  return bins;
}

/**
 * helper function to get the per Capita bins for legend and colors, etc.
 * @param {Array} data all of the states w/ displayValue, complaintCount, raw
 * @param {Array} colors an array of colors
 * @returns {Array} contains bins with bounds, colors, name, and color
 */
export function getPerCapitaBins( data, colors ) {
  const binCount = colors.length;
  const max = data.reduce( findMaxComplaints, 0 );
  const min = 0;

  // Early exit
  if ( max === 0 ) return [];

  const step = ( max - min ) / binCount;
  const bins = [];

  for ( let i = 0, curr = min; i < binCount; i++, curr += step ) {
    const minValue = parseFloat( curr.toFixed( 2 ) )
    const displayValue = minValue.toLocaleString();
    const name = displayValue > 0 ? `≥ ${ displayValue }` : '≥ 0'
    bins.push( {
      from: minValue,
      to: parseFloat( ( curr + step ).toFixed( 2 ) ),
      color: colors[i],
      name,
      shortName: name
    } );
  }

  // The last bin is unbounded
  // eslint-disable-next-line no-undefined
  bins[bins.length - 1].to = undefined;

  return bins;
}

/* ----------------------------------------------------------------------------
   Utility Functions 2 */
/**
 * @param {Object} data - Data to process. add in state paths to the data obj
 * @param {Array} bins - contains different buckets for the values
 * @returns {Object} The processed data.
 */
export function processMapData( data, bins ) {
  // Filter out any empty values just in case
  data = data.filter( function( row ) {
    return Boolean( row.name );
  } );

  data = data.map( function( obj ) {
    const path = STATE_TILES[obj.name];
    return {
      ...obj,
      color: getColorByValue( obj.displayValue, bins ),
      path
    };
  } );

  return data;
}

/**
 * helper function to set the color.
 *
 * Highcharts could normally handle it, but it gets confused by values
 * less than 1 that are frequently encountered in perCapita
 *
 * @param {number} value the number of complaints or perCapita
 * @param {array} bins contains bin objects
 * @returns {string} color hex or rgb code for a color
 */
export function getColorByValue( value, bins ) {
  let color = '#ffffff';
  for ( let i = 0; i < bins.length; i++ ) {
    if ( value > bins[i].from ) {
      color = bins[i].color;
    }
  }
  return color;
}

/* ----------------------------------------------------------------------------
   Highcharts callbacks */

/**
 * callback function to format the individual tiles in HTML
 * @returns {string} html output
 */
export function tileFormatter() {
  const value = this.point.displayValue.toLocaleString();
  return '<div class="highcharts-data-label-state">' +
    '<span class="abbr">' + this.point.name + '</span>' +
    '<span class="value">' + value + '</span>' +
    '</div>';
}

/**
 * callback function to format the tooltip in HTML
 * @returns {string} html output
 */
export function tooltipFormatter() {
  const product = this.product ? '<div class="row u-clearfix">' +
    '<p class="u-float-left">Product with highest complaint volume</p>' +
    '<p class="u-right">' + this.product + '</p>' +
    '</div>' : '';

  const issue = this.issue ? '<div class="row u-clearfix">' +
    '<p class="u-float-left">Issue with highest complaint volume</p>' +
    '<p class="u-right">' + this.issue + '</p>' +
    '</div>' : '';

  const value = this.value.toLocaleString();
  const perCapita = this.perCapita ? '<div class="row u-clearfix">' +
    '<p class="u-float-left">Per capita</p>' +
    '<p class="u-right">' + this.perCapita + '</p>' +
    '</div>' : '';

  return '<div class="title">' + this.fullName + '</div>' +
    '<div class="row u-clearfix">' +
    '<p class="u-float-left">Complaints</p>' +
    '<p class="u-right">' + value + '</p>' +
    '</div>' +
    perCapita +
    product +
    issue;
}

/**
 * Draw a legend on a chart.
 * @param {Object} chart A highchart chart.
 */
export function _drawLegend( chart ) {
  const bins = chart.options.bins;
  let boxWidth = 65;
  const boxHeight = 17;
  let boxPadding = 5;

  const beCompact = chart.chartWidth < 600;
  if ( beCompact ) {
    boxWidth = 45;
    boxPadding = 1;
  }

  /* https://api.highcharts.com/class-reference/Highcharts.SVGRenderer#label
     boxes and labels for legend buckets */
  // main container
  const legendContainer = chart.renderer.g( 'legend-container' )
    .add();

  const legendText = chart.renderer.g( 'legend-title' )
    .translate( boxPadding, 0 )
    .add( legendContainer );
  // key
  chart.renderer
    .label( 'Key', 0, 0, null, null, null, true, false, 'legend-key' )
    .add( legendText );

  // horizontal separator line
  const sepWidth = bins.length * ( boxWidth + boxPadding );
  chart.renderer.path( [ 'M', 0, 0, 'L', sepWidth, 0 ] )
    .attr( {
      'class': 'separator',
      'stroke-width': 1,
      'stroke': 'gray'
    } )
    .translate( 0, 25 )
    .add( legendText );

  // what legend represents
  const labelTx = 'Map shading: <span class="type">' +
    chart.options.legend.legendTitle + '</span>';
  chart.renderer
    .label( labelTx, 0, 28, null, null, null, true, false,
      'legend-description' )
    .add( legendText );

  // bars
  const legend = chart.renderer.g( 'legend__tile-map' )
    .translate( 7, 50 )
    .add( legendContainer );

  for ( let i = 0; i < bins.length; i++ ) {
    const g = chart.renderer.g( `g${ i }` )
      .translate( i * ( boxWidth + boxPadding ), 0 )
      .add( legend );

    const bin = bins[i];

    chart.renderer
      .rect( 0, 0, boxWidth, boxHeight )
      .attr( { fill: bin.color } )
      .addClass( 'legend-box' )
      .add( g );

    chart.renderer
      .text( beCompact ? bin.shortName : bin.name, 0, boxHeight )
      .addClass( 'legend-text' )
      .add( g );
  }
}

/* ----------------------------------------------------------------------------
   Tile Map class */

accessibility( Highcharts );

Highcharts.setOptions( {
  lang: {
    thousandsSep: ','
  }
} );

const colors = [
  'rgba(247, 248, 249, 0.5)',
  'rgba(212, 231, 230, 0.5)',
  'rgba(180, 210, 209, 0.5)',
  'rgba(137, 182, 181, 0.5)',
  'rgba(86, 149, 148, 0.5)',
  'rgba(37, 116, 115, 0.5)'
];

/* ----------------------------------------------------------------------------
   Tile Map class */

class TileMap {
  constructor( { el, data, isPerCapita, events, height, width } ) {
    let bins, legendTitle
    if ( isPerCapita ) {
      bins = getPerCapitaBins( data, colors )
      legendTitle = 'Complaints per 1,000'
    } else {
      bins = getBins( data, colors )
      legendTitle = 'Complaints'
    }

    data = processMapData( data, bins );

    const options = {
      bins,
      chart: {
        styledMode: true,
        height,
        width
      },
      colors,
      colorAxis: {
        dataClasses: bins,
        dataClassColor: 'category'
      },
      title: false,
      credits: false,
      legend: {
        enabled: false,
        legendTitle
      },
      tooltip: {
        className: 'tooltip',
        enabled: true,
        headerFormat: '',
        pointFormatter: tooltipFormatter,
        useHTML: true
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            formatter: tileFormatter,
            useHTML: true
          }
        }
      },

      series: [ {
        type: 'map',
        clip: false,
        data: data
      } ]
    };

    // our custom passing of information
    if ( events ) {
      options.plotOptions.series.events = events;
    }

    this.draw( el, options );
  }

  draw( el, options ) {
    Highcharts.mapChart( el, options, _drawLegend );
  }
}

export default TileMap;
