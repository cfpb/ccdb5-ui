/* eslint complexity: ["error", 5] */
import * as d3 from 'd3';
import accessibility from 'highcharts/modules/accessibility';
import Highcharts from 'highcharts/highmaps';
import { STATE_TILES } from './constants';

const TEN_K = 10000;
const HUN_K = 100000;
const MILLION = 1000000;

const WHITE = '#ffffff';

/* ----------------------------------------------------------------------------
   Utility Functions */

/**
 * Creates N evenly spaced ranges in the data
 *
 * @param {Array} data - all of the states w/ displayValue, complaintCount, raw
 * @param {Array} colors - an array of colors
 * @returns {Array} floating point numbers that mark the max of each range
 */
export function makeScale(data, colors) {
  const allValues = data.map((datum) => datum.displayValue);
  const uniques = new Set(allValues);

  let scale = d3.scaleQuantile().range([WHITE, ...colors]);
  // This catches the condition where all the complaints are in one state
  if (uniques.size < colors.length) {
    scale = scale.domain([...uniques]);
  } else {
    scale = scale.domain(allValues);
  }

  return scale;
}

/**
 * Creates a shorter version of a number. 1,234 => 1.2K
 *
 * @param {number} value - the raw value
 * @returns {string} A string representing a shortened value
 */
export function makeShortName(value) {
  if (value < 1000) {
    return value.toLocaleString();
  } else if (value < TEN_K) {
    return (Math.floor(value / 100) / 10).toFixed(1) + 'K';
  } else if (value < MILLION) {
    return Math.floor(value / 1000) + 'K';
  }

  return (Math.floor(value / HUN_K) / 10).toFixed(1) + 'M';
}

/* ----------------------------------------------------------------------------
   Bin Functions */

/**
 * helper function to get the bins for legend and colors, etc.
 *
 * @param {Array} quantiles - floats that mark the max of each range
 * @param {Function} scale - scaling function for color
 * @returns {Array} the bins with bounds, name, and color
 */
export function getBins(quantiles, scale) {
  const rounds = quantiles.map((quant) => Math.round(quant));
  const ceils = quantiles.map((quant) => Math.ceil(quant));
  const mins = Array.from(new Set(rounds)).filter((round) => round > 0);

  const bins = [{ from: 0, color: WHITE, name: '≥ 0', shortName: '≥ 0' }];

  mins.forEach((minValue) => {
    // The color is the equivalent ceiling from the floor
    const idx = rounds.indexOf(minValue);

    const prefix = ceils[idx] === minValue ? '≥' : '>';
    const displayValue = minValue.toLocaleString();
    const shortened = makeShortName(minValue);

    bins.push({
      from: minValue,
      color: scale(ceils[idx]),
      name: `${prefix} ${displayValue}`,
      shortName: `${prefix} ${shortened}`,
    });
  });

  return bins;
}

/**
 * helper function to get the Per 1000 population bins for legend and colors
 *
 * @param {Array} quantiles - floats that mark the max of each range
 * @param {Function} scale - scaling function for color
 * @returns {Array} the bins with bounds, name, and color
 */
export function getPerCapitaBins(quantiles, scale) {
  const trunc100 = (num) => Math.floor(num * 100) / 100;

  const values = quantiles.map((val) => trunc100(val));
  const mins = Array.from(new Set(values)).filter((val) => val > 0);

  const bins = [{ from: 0, color: WHITE, name: '≥ 0', shortName: '≥ 0' }];

  mins.forEach((minValue) => {
    // The color is the equivalent quantile
    const idx = values.indexOf(minValue);

    const prefix = values[idx] === quantiles[idx] ? '≥' : '>';
    const displayValue = minValue.toFixed(2);
    const name = `${prefix} ${displayValue}`;
    bins.push({
      from: minValue,
      color: scale(quantiles[idx]),
      name,
      shortName: name,
    });
  });

  return bins;
}

/* ----------------------------------------------------------------------------
   Utility Functions 2 */
/**
 * @param {object} data - Data to process. add in state paths to the data obj
 * @param {Function} scale - scaling function for color
 * @returns {object} The processed data.
 */
export function processMapData(data, scale) {
  // Filter out any empty values just in case
  data = data.filter(function (row) {
    return Boolean(row.name);
  });

  const isFiltered = data.filter((obj) => obj.className === 'selected').length;
  data = data.map(function (obj) {
    const path = STATE_TILES[obj.name];
    let color = getColorByValue(obj.displayValue, scale);

    if (isFiltered && obj.className === 'deselected') {
      // update rgba opacity for selected state
      color = color.replace('1)', '0.5)');
    }

    if (obj.className !== 'selected' && color === WHITE) {
      // handle cases where value is empty or no color, so we can set the border
      obj.className = 'empty';
    }

    return {
      ...obj,
      color,
      path,
    };
  });

  return data;
}

/**
 * helper function to set the color.
 *
 * Highcharts could normally handle it, but it gets confused by values
 * less than 1 that are frequently encountered in perCapita
 *
 * Also, walk through the array backwards to pick up the most saturated
 * color. This helps the "only three values" case
 *
 * @param {number} value - the number of complaints or perCapita
 * @param {Function} scale - scaling function for color
 * @returns {string} color hex or rgb code for a color
 */
export function getColorByValue(value, scale) {
  if (!value) return WHITE;

  return scale(value);
}

/* ----------------------------------------------------------------------------
   Highcharts callbacks */

/**
 * callback function for reporting the series point in a voiceover text
 *
 * @param {object} point - the point in the series
 * @returns {string} the text to speak
 */
export function descriptionFormatter(point) {
  return `${point.fullName} ${point.displayValue}`;
}

/**
 * callback function for mouseout a point to remove hover class from tile label
 */
export function mouseoutPoint() {
  const name = '.tile-' + this.name;
  d3.select(name).classed('hover', false);
}

/**
 * callback function for mouseover point to add hover class to tile label
 */
export function mouseoverPoint() {
  const name = '.tile-' + this.name;
  d3.select(name).classed('hover', true);
}

/**
 * callback function to format the individual tiles in HTML
 *
 * @returns {string} html output
 */
export function tileFormatter() {
  const value = this.point.displayValue.toLocaleString();
  return (
    '<div class="highcharts-data-label-state tile-' +
    this.point.name +
    ' ' +
    this.point.className +
    ' ">' +
    '<span class="abbr">' +
    this.point.name +
    '</span>' +
    '<span class="value">' +
    value +
    '</span>' +
    '</div>'
  );
}

/**
 * callback function to format the tooltip in HTML
 *
 * @returns {string} html output
 */
export function tooltipFormatter() {
  const product = this.product
    ? '<div class="row u-clearfix">' +
      '<p class="u-float-left">Product with highest complaint volume</p>' +
      '<p class="u-right">' +
      this.product +
      '</p>' +
      '</div>'
    : '';

  const issue = this.issue
    ? '<div class="row u-clearfix">' +
      '<p class="u-float-left">Issue with highest complaint volume</p>' +
      '<p class="u-right">' +
      this.issue +
      '</p>' +
      '</div>'
    : '';

  const value = this.value.toLocaleString();
  const perCapita = this.perCapita
    ? '<div class="row u-clearfix">' +
      '<p class="u-float-left">Per 1000 population</p>' +
      '<p class="u-right">' +
      this.perCapita +
      '</p>' +
      '</div>'
    : '';

  return (
    '<div class="title">' +
    this.fullName +
    '</div>' +
    '<div class="row u-clearfix">' +
    '<p class="u-float-left">Complaints</p>' +
    '<p class="u-right">' +
    value +
    '</p>' +
    '</div>' +
    perCapita +
    product +
    issue
  );
}

/**
 * Draw a legend on a chart.
 *
 * @param {object} chart - A highchart chart.
 */
export function _drawLegend(chart) {
  const bins = chart.options.bins;
  let boxWidth = 65;
  const boxHeight = 17;
  let boxPadding = 5;

  const beCompact = chart.chartWidth < 600;
  if (beCompact) {
    boxWidth = 45;
    boxPadding = 1;
  }

  /* https://api.highcharts.com/class-reference/Highcharts.SVGRenderer#label
     boxes and labels for legend buckets */
  // main container
  const legendContainer = chart.renderer.g('legend-container').add();

  const legendText = chart.renderer
    .g('legend-title')
    .translate(boxPadding, 0)
    .add(legendContainer);
  // key
  chart.renderer
    .label('Key', 0, 0, null, null, null, true, false, 'legend-key')
    .add(legendText);

  // horizontal separator line
  const sepWidth = bins.length * (boxWidth + boxPadding);
  chart.renderer
    .path(['M', 0, 0, 'L', sepWidth, 0])
    .attr({
      class: 'separator',
      'stroke-width': 1,
      stroke: 'gray',
    })
    .translate(0, 25)
    .add(legendText);

  // what legend represents
  const labelTx =
    'Map shading: <span class="type">' +
    chart.options.legend.legendTitle +
    '</span>';
  chart.renderer
    .label(labelTx, 0, 28, null, null, null, true, false, 'legend-description')
    .add(legendText);

  // bars
  const legend = chart.renderer
    .g('legend__tile-map')
    .translate(7, 50)
    .add(legendContainer);

  for (let idx = 0; idx < bins.length; idx++) {
    const rend = chart.renderer
      .g(`g${idx}`)
      .translate(idx * (boxWidth + boxPadding), 0)
      .add(legend);

    const bin = bins[idx];

    chart.renderer
      .rect(0, 0, boxWidth, boxHeight)
      .attr({ fill: bin.color })
      .addClass('legend-box')
      .add(rend);

    chart.renderer
      .text(beCompact ? bin.shortName : bin.name, 0, boxHeight)
      .addClass('legend-text')
      .translate(3, -3)
      .add(rend);
  }
}

/* ----------------------------------------------------------------------------
   Tile Map class */

accessibility(Highcharts);

Highcharts.setOptions({
  lang: {
    thousandsSep: ',',
  },
});

const colors = [
  'rgba(212, 231, 230, 1)',
  'rgba(180, 210, 209, 1)',
  'rgba(158, 196, 195, 1)',
  'rgba(137, 182, 181, 1)',
  'rgba(112, 166, 165, 1)',
  'rgba(87, 150, 149, 1)',
];

/* ----------------------------------------------------------------------------
   Tile Map class */

class TileMap {
  constructor({ el, data, isPerCapita, events, height, hasTip, width }) {
    const scale = makeScale(data, colors);
    const quantiles = scale.quantiles();

    let bins, legendTitle;
    if (isPerCapita) {
      bins = getPerCapitaBins(quantiles, scale);
      legendTitle = 'Complaints per 1,000';
    } else {
      bins = getBins(quantiles, scale);
      legendTitle = 'Complaints';
    }

    data = processMapData(data, scale);

    const options = {
      accessibility: {
        description: '',
        screenReaderSection: {
          afterChartFormat: '',
          beforeChartFormat: '',
        },
      },

      bins,
      chart: {
        styledMode: true,
        height,
        width,
      },
      colorAxis: {
        dataClasses: bins,
        dataClassColor: 'category',
      },
      title: false,
      credits: false,
      legend: {
        enabled: false,
        legendTitle,
      },
      tooltip: {
        className: 'tooltip',
        enabled: hasTip,
        headerFormat: '',
        pointFormatter: tooltipFormatter,
        useHTML: true,
      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            formatter: tileFormatter,
            useHTML: true,
          },
          states: {
            hover: {
              enabled: hasTip,
            },
          },
        },
      },

      series: [
        {
          type: 'map',
          clip: false,
          data: data,
          accessibility: {
            description: legendTitle + ' in the United States',
            exposeAsGroupOnly: false,
            keyboardNavigation: { enabled: true },
            descriptionFormatter: descriptionFormatter,
          },
        },
      ],
    };

    // our custom passing of information
    if (events && hasTip) {
      options.plotOptions.series.events = events;
      options.plotOptions.series.point = {
        events: {
          mouseOver: mouseoverPoint,
          mouseOut: mouseoutPoint,
        },
      };
    }

    // to adjust for legend height
    const mapBreakpoints = [
      { width: 700, legendHeight: 20 },
      { width: 580, legendHeight: 25 },
      { width: 500, legendHeight: 35 },
      { width: 400, legendHeight: 60 },
      { width: 370, legendHeight: 70 },
    ];

    let legendHeight = 10;

    mapBreakpoints.forEach((item) => {
      if (width < item.width) {
        legendHeight = item.legendHeight;
      }
    });

    options.chart.marginRight = 0;
    options.chart.marginLeft = 0;
    options.chart.marginTop = legendHeight;
    options.chart.height += legendHeight;

    this.draw(el, options);
  }

  draw(el, options) {
    Highcharts.mapChart(el, options, _drawLegend);
  }
}

export default TileMap;
