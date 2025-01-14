// ----------------------------------------------------------------------------
/* eslint-disable complexity */
import { adjustDate, isDateEqual, formatDisplayDate } from './formatDate';
import { clampDate, coalesce } from '../utils';
import dayjs from 'dayjs';
import dayjsQuarterOfYear from 'dayjs/plugin/quarterOfYear';
import dayjsTimezone from 'dayjs/plugin/timezone';
import dayjsUtc from 'dayjs/plugin/utc';
import * as colors from '../constants/colors';

dayjs.extend(dayjsQuarterOfYear);
dayjs.extend(dayjsUtc);
dayjs.extend(dayjsTimezone);
// this is how we enforce standard tooltip.
// ci has Africa/Abidjan
dayjs.tz.setDefault('America/New_York');

export const getLastDate = (dataSet, config) => {
  // take in array of data points
  // early exit
  if (!dataSet || dataSet.length === 0) {
    return null;
  }

  const deDuped = [
    ...new Set(dataSet.map((obj) => dayjs(obj.date).toISOString())),
  ].sort();
  const lastDate = deDuped.pop();
  const lastPointValues = dataSet.filter((obj) =>
    isDateEqual(obj.date, lastDate),
  );
  return {
    key: lastDate,
    date: lastDate,
    dateRange: config.dateRange,
    interval: config.interval,
    values: lastPointValues,
  };
};

export const getLastLineDate = (dataSet, config) => {
  // take in array of data points
  if (!dataSet || !dataSet.dataByTopic || dataSet.dataByTopic.length === 0) {
    return null;
  }

  let dates = [];
  dataSet.dataByTopic.forEach((datum) => {
    dates = dates.concat(datum.dates);
  });

  const deDuped = [...new Set(dates.map((obj) => obj.date))].sort();
  const lastDate = deDuped.pop();
  const values = dataSet.dataByTopic.map((datum) => {
    const lastPoint = datum.dates.find((val) =>
      isDateEqual(val.date, lastDate),
    );
    const value = lastPoint ? lastPoint.value : 0;
    return {
      name: datum.topic,
      date: lastDate,
      value,
    };
  });

  const lastPoint = {
    key: lastDate,
    date: lastDate,
    dateRange: config.dateRange,
    interval: config.interval,
    values,
  };
  return lastPoint;
};

export const getTooltipDate = (inputDate, dateRange) => {
  const adjustedDate = adjustDate(inputDate);
  const returnDate = clampDate(adjustedDate, dateRange.from, dateRange.to);
  return formatDisplayDate(returnDate);
};

export const getTooltipTitle = (inputDate, interval, dateRange, external) => {
  /* eslint complexity: ["error", 6] */
  interval = interval.toLowerCase();
  const startDate = getTooltipDate(inputDate, dateRange);

  let endDate = dayjs(inputDate).utc();

  switch (interval) {
    case 'day':
      endDate = endDate.format();
      break;
    case 'week':
    case 'year':
      endDate = endDate.add(1, interval).subtract(1, 'day').format();
      break;
    case 'quarter':
    case 'month':
    default:
      endDate = endDate.endOf(interval).subtract(1, 'day').format();
      break;
  }

  endDate = getTooltipDate(endDate, dateRange);

  if (interval === 'day') {
    return `Date: ${endDate}`;
  }

  return external
    ? `Date range: ${startDate} - ${endDate}`
    : `${startDate} - ${endDate}`;
};

/**
 * helper to generate chart name for row chart based on trends
 *
 * @param {Array} rowNames - passed from trends.results reducer
 * @param {object} colorMap - of the chart for display
 * @param {string} lens - determines which colors to use for defaults
 * @returns {Array} the color scheme [blue, red, yellow, etc]
 */
export const getColorScheme = (rowNames, colorMap, lens) =>
  rowNames.map((obj) => {
    if (!colorMap) {
      return '#20aa3f';
    }
    // bad data. Some titles can appears twice in the product data
    const name = obj.name.trim();
    const parent = obj.parent ? obj.parent.trim() : '';
    // parent should have priority
    if (colorMap[parent]) {
      return colorMap[parent];
    } else if (colorMap[name]) {
      return colorMap[name];
    }

    // return default grey when it's data lens and not in area/line chart
    // #a2a3a4
    return lens === 'Overview' ? '#20aa3f' : '#a2a3a4';
  });

/**
 * helper function to get d3 bar chart data
 *
 * @param {object} obj - rowdata we are processing
 * @param {Array} nameMap - list of names we are keeping track of
 * @returns {object} the rowdata for row chart
 */
export const getD3Names = (obj, nameMap) => {
  let name = obj.key;
  // D3 doesnt allow dupe keys, so we have to to append
  // spaces so we have unique keys
  while (nameMap[name]) {
    name += ' ';
  }

  nameMap[name] = true;

  return obj.splitterText
    ? obj
    : {
        hasChildren: Boolean(obj.hasChildren),
        isNotFilter: false,
        isParent: Boolean(obj.isParent),
        name: name,
        value: Number(obj.doc_count),
        parent: obj.parent || false,
        // this adjusts the thickness of the parent or child bars
        width: obj.parent ? 0.4 : 0.5,
      };
};

export const processRows = (data, colorMap, lens, expandedRows) => {
  const rows = structuredClone(data);
  if (rows) {
    let data = rows;
    data = data.filter(
      (datum) => datum.isParent || expandedRows.includes(datum.parent),
    );
    const colorScheme = getColorScheme(data, colorMap, lens);

    return {
      colorScheme,
      data,
    };
  }

  return {
    colorScheme: [],
    data: [],
  };
};

/**
 * The api sends us the date buckets in older -> new order
 * however, in data lens / company aggregation it's reversed
 * we also need to fill any empty area buckets when dates are missing
 *
 * @param {string} name - bucket name
 * @param {Array} buckets - contains dates and value paired objects
 * @param {Array} areaBuckets - the reference dates we check against
 * @returns {Array} the sorted array in old-> newest
 */
export const updateDateBuckets = (name, buckets, areaBuckets) => {
  // fill in empty zero values
  areaBuckets.forEach((obj) => {
    if (!buckets.find((bucket) => bucket.key_as_string === obj.key_as_string)) {
      buckets.push({
        name: name,
        doc_count: 0,
        key_as_string: obj.key_as_string,
      });
    }
  });

  return buckets

    .sort((first, second) =>
      first.key_as_string > second.key_as_string ? 1 : -1,
    )
    .map((obj) => ({
      name: name,
      date: obj.key_as_string,
      value: obj.doc_count,
    }));
};

export const externalTooltipFormatter = (tooltip, colorMap) => {
  if (!tooltip) {
    return tooltip;
  }
  const newTooltip = structuredClone(tooltip);
  const parts = tooltip.title.split(':');
  const colorValues = Object.values(colors.DataLens);
  newTooltip.values.forEach((obj) => {
    // const newObj = { ...obj };
    if (!Object.hasOwn(obj, 'colorIndex')) {
      obj.colorIndex = colorValues.indexOf(colorMap[obj.name]) || 0;
    }
    // make sure all values have a value
    if (!Object.hasOwn(obj, 'value')) {
      obj.value = coalesce(obj, 'value', 0);
    }
  });

  return {
    ...newTooltip,
    heading: parts[0] + ':',
    date: parts[1] ? parts[1].trim() : '',
  };
};

export const dateOutOfStartBounds = (dateFrom, startFromChart, interval) => {
  const completeStartPeriod = dayjs(startFromChart)
    .utc()
    .startOf(interval.toLowerCase());
  const dateRangeFrom = dayjs(dateFrom).utc();
  const isSameFrom = dateRangeFrom.isSame(completeStartPeriod, 'day');
  return !isSameFrom;
};

export const dateOutOfEndBounds = (dateTo, lastFromChart, interval) => {
  const completeEndPeriod = dayjs(lastFromChart)
    .utc()
    .endOf(interval.toLowerCase());
  const dateRangeTo = dayjs(dateTo).utc();
  const isSameTo = dateRangeTo.isSame(completeEndPeriod, 'day');
  const afterEnd = completeEndPeriod.isAfter(dateRangeTo);

  return afterEnd && !isSameTo;
};

/**
 * Helper function to determine if the array passed has no dates
 *
 * @param {object} data - Contains an object for the LineCharts.
 * @returns {boolean} Tells us whether we have dates to render the chart.
 */
export const isLineDataEmpty = (data) => {
  return (
    !data ||
    !data.dataByTopic ||
    !data.dataByTopic.length ||
    !data.dataByTopic[0].dates.length ||
    // we consider line data to be empty if length < 2
    // since you need at least 2 points to plot
    data.dataByTopic[0].dates.length < 2
  );
};

/**
 * Helper function to determine if the array passed does not have enough dates
 *
 * @param {Array} data - Contains an array of objects for the StackedAreaCharts.
 * @returns {boolean} Tells us whether we have dates to render the chart.
 */
export const isStackedAreaDataEmpty = (data) => {
  if (!data || !data.length) {
    return true;
  }
  const allDates = [...new Set(data.map((obj) => obj.date))];
  return allDates.length < 2;
};

/**
 * Removes incomplete date periods from the line chart
 *
 * @param {object} data - Object containing arrays to render a line chart
 * @param {object} dateRange - Object containing dateFrom and dateTo
 * @param {string} interval - Month, Day, Year, Quarter, etc
 * @returns {object} Object containing parameters to render the line charts.
 */
export const pruneIncompleteLineInterval = (data, dateRange, interval) => {
  const dataClone = structuredClone(data);
  const { from: dateFrom, to: dateTo } = dateRange;
  if (!dataClone.dataByTopic) {
    return data;
  }

  const dates = dataClone.dataByTopic[0].dates;
  // date from chart
  const startFromChart = dataClone.dataByTopic[0].dates[0].date;
  const lastFromChart = dataClone.dataByTopic[0].dates[dates.length - 1].date;

  // start date from chart same as date range from, then go ahead keep it
  if (dateOutOfStartBounds(dateFrom, startFromChart, interval)) {
    dataClone.dataByTopic.forEach((datum) => {
      datum.dates = datum.dates.filter((date) => date.date !== startFromChart);
    });
  }

  // we only eliminate the last incomplete interval
  // this is if the end date of the interval comes after To Date
  if (dateOutOfEndBounds(dateTo, lastFromChart, interval)) {
    dataClone.dataByTopic.forEach((datum) => {
      datum.dates = datum.dates.filter((date) => date.date !== lastFromChart);
    });
  }
  return dataClone;
};

export const pruneIncompleteStackedAreaInterval = (
  data,
  dateRange,
  interval,
) => {
  const { from: dateFrom, to: dateTo } = dateRange;
  let filteredData = structuredClone(data);
  //  need to rebuild and sort dates in memory
  const dates = [...new Set(filteredData.map((datum) => datum.date))];
  dates.sort();

  const startFromChart = dates[0];
  const lastFromChart = dates[dates.length - 1];
  // start date from chart same as date range from, then go ahead keep it
  if (dateOutOfStartBounds(dateFrom, startFromChart, interval)) {
    filteredData = filteredData.filter(
      (datum) => datum.date !== startFromChart,
    );
  }

  if (dateOutOfEndBounds(dateTo, lastFromChart, interval)) {
    filteredData = filteredData.filter((datum) => datum.date !== lastFromChart);
  }

  return filteredData;
};
