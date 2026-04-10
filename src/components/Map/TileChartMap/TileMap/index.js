/* eslint complexity: ["error", 5] */
import * as d3 from 'd3';
import Highcharts from 'highcharts/highmaps';
import 'highcharts/modules/accessibility';
import { STATE_TILES } from './constants';
import { getAppRoot } from '../../../../utils/dom';

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
 * @param {function(number): string} scale - scaling function for color
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
 * @param {function(number): string} scale - scaling function for color
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
 * @param {function(number): string} scale - scaling function for color
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
 * @param {function(number): string} scale - scaling function for color
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
  d3.select(getAppRoot()).select(name).classed('hover', false);
}

/**
 * callback function for mouseover point to add hover class to tile label
 */
export function mouseoverPoint() {
  const name = '.tile-' + this.name;
  d3.select(getAppRoot()).select(name).classed('hover', true);
}

/**
 * callback function to format the individual tiles in HTML
 *
 * @returns {string} html output
 */
export function tileFormatter() {
  const point = this.point || this;
  const value =
    typeof point.displayValue === 'number'
      ? point.displayValue >= 1000
        ? `${Math.floor(point.displayValue / 1000)}K`
        : point.displayValue.toLocaleString()
      : point.displayValue || '';
  return (
    '<div class="highcharts-data-label-state tile-' +
    point.name +
    ' ' +
    point.className +
    ' ">' +
    '<p class="abbr">' +
    point.name +
    '</p>' +
    '<p class="value">' +
    value +
    '</p>' +
    '</div>'
  );
}

/**
 * callback function to format the tooltip in HTML
 *
 * @returns {string} html output
 */
export function tooltipFormatter() {
  const info =
    this.product || this.issue
      ? '<h5 class="line">Highest complaint volume</h5>'
      : '';
  const product = this.product
    ? `<p><strong>Product: </strong>${this.product}</p>`
    : '';

  const issue = this.issue
    ? `<p><strong>Issue: </strong>${this.issue}</p>`
    : '';

  const value = this.value.toLocaleString();
  return (
    `<div class=""><h4>${this.fullName} (${this.name})</h4></div>` +
    `<div class="row"><h5 class="u-mb10">Complaint count</h5><p>${value}</p></div>` +
    info +
    product +
    issue
  );
}

/**
 * Determine tooltip placement based on point and chart bounds.
 *
 * @param {object} root0 - Tooltip placement inputs.
 * @param {number} root0.plotX - Point X within plot area.
 * @param {number} root0.plotY - Point Y within plot area.
 * @param {number} root0.plotWidth - Plot area width.
 * @param {number} root0.plotHeight - Plot area height.
 * @param {number} root0.labelWidth - Tooltip label width.
 * @param {number} root0.labelHeight - Tooltip label height.
 * @returns {'top' | 'bottom' | 'left' | 'right'} Placement.
 */
/**
 * Compute available space around a point in the plot area.
 *
 * @param {object} root0 - Space inputs.
 * @param {number} root0.plotX - Point X within plot area.
 * @param {number} root0.plotY - Point Y within plot area.
 * @param {number} root0.plotWidth - Plot area width.
 * @param {number} root0.plotHeight - Plot area height.
 * @returns {object} Space values.
 */
function getPointSpaces({ plotX, plotY, plotWidth, plotHeight }) {
  return {
    top: plotY,
    bottom: plotHeight - plotY,
    left: plotX,
    right: plotWidth - plotX,
  };
}

/**
 * Determine which placements have enough space.
 *
 * @param {object} root0 - Space inputs.
 * @param {object} root0.spaces - Space values.
 * @param {number} root0.labelWidth - Tooltip label width.
 * @param {number} root0.labelHeight - Tooltip label height.
 * @param {number} root0.gap - Gap between point and tooltip.
 * @returns {object} Fit map.
 */
function getPlacementFits({ spaces, labelWidth, labelHeight, gap }) {
  return {
    top: spaces.top >= labelHeight + gap,
    bottom: spaces.bottom >= labelHeight + gap,
    left: spaces.left >= labelWidth + gap,
    right: spaces.right >= labelWidth + gap,
  };
}

/**
 * Order preferred placements based on point location.
 *
 * @param {object} root0 - Location inputs.
 * @param {number} root0.plotX - Point X within plot area.
 * @param {number} root0.plotY - Point Y within plot area.
 * @param {number} root0.plotWidth - Plot area width.
 * @param {number} root0.plotHeight - Plot area height.
 * @returns {Array<'top' | 'bottom' | 'left' | 'right'>} Preference order.
 */
function getPreferredPlacements({ plotX, plotY, plotWidth, plotHeight }) {
  const leftThird = plotWidth * 0.33;
  const rightThird = plotWidth * 0.66;
  const topThird = plotHeight * 0.33;
  const bottomThird = plotHeight * 0.66;

  if (plotX <= leftThird) return ['right', 'top', 'bottom', 'left'];
  if (plotX >= rightThird) return ['left', 'top', 'bottom', 'right'];
  if (plotY <= topThird) return ['bottom', 'left', 'right', 'top'];
  if (plotY >= bottomThird) return ['top', 'left', 'right', 'bottom'];

  return ['top', 'bottom', 'right', 'left'];
}

/**
 * Pick the first placement that fits.
 *
 * @param {object} fits - Fit map.
 * @param {Array<'top' | 'bottom' | 'left' | 'right'>} order - Placement order.
 * @returns {'top' | 'bottom' | 'left' | 'right' | null} Placement.
 */
function pickPlacement(fits, order) {
  for (const placement of order) {
    if (fits[placement]) {
      return placement;
    }
  }
  return null;
}

/**
 * Determine tooltip placement based on point and chart bounds.
 *
 * @param {object} root0 - Tooltip placement inputs.
 * @param {number} root0.plotX - Point X within plot area.
 * @param {number} root0.plotY - Point Y within plot area.
 * @param {number} root0.plotWidth - Plot area width.
 * @param {number} root0.plotHeight - Plot area height.
 * @param {number} root0.labelWidth - Tooltip label width.
 * @param {number} root0.labelHeight - Tooltip label height.
 * @returns {'top' | 'bottom' | 'left' | 'right'} Placement.
 */
function getTooltipPlacement({
  plotX,
  plotY,
  plotWidth,
  plotHeight,
  labelWidth,
  labelHeight,
}) {
  const gap = 12;
  const spaces = getPointSpaces({ plotX, plotY, plotWidth, plotHeight });
  const fits = getPlacementFits({ spaces, labelWidth, labelHeight, gap });
  const preferred = pickPlacement(
    fits,
    getPreferredPlacements({ plotX, plotY, plotWidth, plotHeight }),
  );
  const fallback = pickPlacement(fits, ['top', 'bottom', 'right', 'left']);

  return preferred || fallback || 'top';
}

/**
 * Clamp a number between two bounds.
 *
 * @param {number} value - Value to clamp.
 * @param {number} min - Minimum allowed value.
 * @param {number} max - Maximum allowed value.
 * @returns {number} Clamped value.
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

const TOOLTIP_AXIS_X = 'x';
const TOOLTIP_AXIS_Y = 'y';
const TOOLTIP_INSET = 8;

/**
 * Compute the tooltip anchor coordinates for a placement.
 *
 * @param {'top' | 'bottom' | 'left' | 'right'} placement - Tooltip placement.
 * @param {number} plotX - Point X within plot area.
 * @param {number} plotY - Point Y within plot area.
 * @param {number} labelWidth - Tooltip label width.
 * @param {number} labelHeight - Tooltip label height.
 * @returns {object} Anchor coordinates.
 */
function getTooltipAnchor(placement, plotX, plotY, labelWidth, labelHeight) {
  const gap = 12;
  const centerX = plotX - labelWidth / 2;
  const aboveY = plotY - labelHeight - gap;
  if (placement === 'bottom') {
    return { coordX: centerX, coordY: plotY + gap };
  }
  if (placement === 'left') {
    return {
      coordX: plotX - labelWidth - gap,
      coordY: plotY - labelHeight / 2,
    };
  }
  if (placement === 'right') {
    return { coordX: plotX + gap, coordY: plotY - labelHeight / 2 };
  }
  return { coordX: centerX, coordY: aboveY };
}

/**
 * Compute caret offset for the tooltip edge.
 *
 * @param {'top' | 'bottom' | 'left' | 'right'} placement - Tooltip placement.
 * @param {number} plotX - Point X within plot area.
 * @param {number} plotY - Point Y within plot area.
 * @param {number} coordX - Tooltip X within plot area.
 * @param {number} coordY - Tooltip Y within plot area.
 * @param {number} labelWidth - Tooltip label width.
 * @param {number} labelHeight - Tooltip label height.
 * @returns {number} Caret offset.
 */
function getCaretOffset(
  placement,
  plotX,
  plotY,
  coordX,
  coordY,
  labelWidth,
  labelHeight,
) {
  const edgePadding = 12;
  const spanWidth = Math.max(labelWidth - TOOLTIP_INSET * 2, 0);
  const spanHeight = Math.max(labelHeight - TOOLTIP_INSET * 2, 0);
  if (placement === 'left' || placement === 'right') {
    return clamp(
      plotY - coordY - TOOLTIP_INSET,
      edgePadding,
      spanHeight - edgePadding,
    );
  }
  return clamp(
    plotX - coordX - TOOLTIP_INSET,
    edgePadding,
    spanWidth - edgePadding,
  );
}

/**
 * Compute tooltip coordinates and caret placement.
 *
 * @param {object} root0 - Tooltip geometry inputs.
 * @param {number} root0.plotX - Point X within plot area.
 * @param {number} root0.plotY - Point Y within plot area.
 * @param {number} root0.plotWidth - Plot area width.
 * @param {number} root0.plotHeight - Plot area height.
 * @param {number} root0.labelWidth - Tooltip label width.
 * @param {number} root0.labelHeight - Tooltip label height.
 * @returns {object} Tooltip position data.
 */
function computeTooltipPosition({
  plotX,
  plotY,
  plotWidth,
  plotHeight,
  labelWidth,
  labelHeight,
}) {
  const placement = getTooltipPlacement({
    plotX,
    plotY,
    plotWidth,
    plotHeight,
    labelWidth,
    labelHeight,
  });
  const anchor = getTooltipAnchor(
    placement,
    plotX,
    plotY,
    labelWidth,
    labelHeight,
  );
  const coordX = clamp(anchor.coordX, 0, plotWidth - labelWidth);
  const coordY = clamp(anchor.coordY, 0, plotHeight - labelHeight);
  const caretPos = getCaretOffset(
    placement,
    plotX,
    plotY,
    coordX,
    coordY,
    labelWidth,
    labelHeight,
  );

  return {
    caretPos,
    placement,
    coordX,
    coordY,
  };
}

/**
 * Resolve tooltip DOM nodes for caret placement.
 *
 * @param {object|null} label - Highcharts tooltip label.
 * @returns {object} Tooltip wrapper and span nodes.
 */
// eslint-disable-next-line complexity
function getTooltipElements(label) {
  const htmlRoot = label?.div || label?.element || null;
  const wrapper =
    htmlRoot && htmlRoot.classList?.contains('highcharts-tooltip')
      ? htmlRoot
      : htmlRoot?.parentNode || null;
  const span = htmlRoot?.querySelector
    ? htmlRoot.querySelector('span')
    : wrapper?.querySelector?.('span') || null;

  return { wrapper, span };
}

/**
 * Apply caret metadata to tooltip DOM nodes.
 *
 * @param {object|null} label - Highcharts tooltip label.
 * @param {'top' | 'bottom' | 'left' | 'right'} placement - Tooltip placement.
 * @param {number} caretPos - Caret offset along the tooltip edge.
 */
function applyTooltipCaret(label, placement, caretPos) {
  const { wrapper, span } = getTooltipElements(label);
  if (wrapper?.setAttribute) {
    wrapper.setAttribute('data-caret', placement);
    wrapper.style.setProperty('--caret-pos', `${caretPos}px`);
  }
  if (span?.setAttribute) {
    span.setAttribute('data-caret', placement);
    span.style.setProperty('--caret-pos', `${caretPos}px`);
  }
}

/**
 * Highcharts tooltip positioner.
 *
 * @param {number} labelWidth - Tooltip width.
 * @param {number} labelHeight - Tooltip height.
 * @param {object} point - Highcharts point.
 * @returns {object} Tooltip coordinates.
 */
function tooltipPositioner(labelWidth, labelHeight, point) {
  if (!point) {
    return { [TOOLTIP_AXIS_X]: 0, [TOOLTIP_AXIS_Y]: 0 };
  }

  const chart = this.chart;
  const plotX = point.plotX ?? 0;
  const plotY = point.plotY ?? 0;
  const position = computeTooltipPosition({
    plotX,
    plotY,
    plotWidth: chart.plotWidth,
    plotHeight: chart.plotHeight,
    labelWidth,
    labelHeight,
  });

  applyTooltipCaret(this.label, position.placement, position.caretPos);

  return {
    [TOOLTIP_AXIS_X]: chart.plotLeft + position.coordX,
    [TOOLTIP_AXIS_Y]: chart.plotTop + position.coordY,
  };
}

/* ----------------------------------------------------------------------------
   Tile Map class */

Highcharts.setOptions({
  lang: {
    thousandsSep: ',',
  },
});

export const TILE_MAP_COLORS = [
  'rgb(240, 247, 246)',
  'rgb(212, 231, 230)',
  'rgb(180, 210, 209)',
  'rgb(137, 182, 181)',
  'rgb(87, 150, 149)',
];

/* ----------------------------------------------------------------------------
   Tile Map class */

class TileMap {
  constructor({ el, data, isPerCapita, events, height, hasTip, width }) {
    const scale = makeScale(data, TILE_MAP_COLORS);
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
        positioner: tooltipPositioner,
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
      const { click, ...seriesEvents } = events;
      if (Object.keys(seriesEvents).length) {
        options.plotOptions.series.events = seriesEvents;
      }
      options.plotOptions.series.point = {
        events: {
          mouseOver: mouseoverPoint,
          mouseOut: mouseoutPoint,
          click: function (event) {
            if (!click) return;
            const normalizedEvent = event
              ? { ...event, point: this }
              : { point: this };
            click(normalizedEvent);
          },
        },
      };
    }
    options.chart.marginTop = 30;
    options.chart.marginBottom = 30;
    options.chart.marginRight = 30;
    options.chart.marginLeft = 30;

    this.draw(el, options);
  }

  draw(el, options) {
    Highcharts.mapChart(el, options);
  }
}

export default TileMap;
