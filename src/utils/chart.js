// ----------------------------------------------------------------------------
/* eslint-disable no-mixed-operators, camelcase, complexity */
import { adjustDate, isDateEqual } from './formatDate';
import { clampDate, shortFormat } from '../utils';

import dayjs from 'dayjs';
import dayjsQuarterOfYear from 'dayjs/plugin/quarterOfYear';
import dayjsTimezone from 'dayjs/plugin/timezone';
import dayjsUtc from 'dayjs/plugin/utc';

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
    ...new Set(dataSet.map((o) => dayjs(o.date).toISOString())),
  ].sort();
  const lastDate = deDuped.pop();
  const lastPointValues = dataSet.filter((o) => isDateEqual(o.date, lastDate));
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
  dataSet.dataByTopic.forEach((d) => {
    dates = dates.concat(d.dates);
  });

  const deDuped = [...new Set(dates.map((o) => o.date))].sort();
  const lastDate = deDuped.pop();
  const values = dataSet.dataByTopic.map((o) => {
    const lastPoint = o.dates.find((v) => isDateEqual(v.date, lastDate));
    const value = lastPoint ? lastPoint.value : 0;
    return {
      name: o.topic,
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
  return shortFormat(returnDate);
};

export const getTooltipTitle = (inputDate, interval, dateRange, external) => {
  /* eslint complexity: ["error", 6] */
  let givenDate =
    typeof inputDate !== 'object' ? new Date(inputDate) : inputDate;
  givenDate = dayjs(givenDate).utc().startOf('day').toDate();
  interval = interval.toLowerCase();
  const startDate = getTooltipDate(givenDate, dateRange);

  let endDate;

  switch (interval) {
    case 'day':
      endDate = dayjs(givenDate).format();
      break;

    case 'week':
    case 'year':
      endDate = dayjs(givenDate).add(1, interval).subtract(1, 'day').format();
      break;

    case 'quarter':
      endDate = dayjs(givenDate)
        .utc()
        .endOf(interval)
        .subtract(1, 'day')
        .format();
      break;
    case 'month':
    default:
      endDate = dayjs(givenDate)
        .add(1, interval)
        .endOf(interval)
        .subtract(1, 'day')
        .format();
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
  rowNames.map((o) => {
    if (!colorMap) {
      return '#20aa3f';
    }
    // bad data. Some titles can appears twice in the product data
    const name = o.name.trim();
    const parent = o.parent ? o.parent.trim() : '';
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

export const processRows = (rows, colorMap, lens, expandedRows) => {
  if (rows) {
    let data = rows;
    data = data.filter((o) => o.isParent || expandedRows.includes(o.parent));
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
  areaBuckets.forEach((o) => {
    if (!buckets.find((b) => b.key_as_string === o.key_as_string)) {
      buckets.push({
        name: name,
        doc_count: 0,
        key_as_string: o.key_as_string,
      });
    }
  });

  return (
    buckets
      // eslint-disable-next-line no-confusing-arrow, no-extra-parens
      .sort((a, b) => (a.key_as_string > b.key_as_string ? 1 : -1))
      .map((o) => ({
        name: name,
        date: o.key_as_string,
        value: o.doc_count,
      }))
  );
};

export const externalTooltipFormatter = (tooltip) => {
  if (!tooltip) {
    return tooltip;
  }
  const parts = tooltip.title.split(':');
  return {
    ...tooltip,
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

export const pruneIncompleteLineInterval = (data, dateRange, interval) => {
  const { from: dateFrom, to: dateTo } = dateRange;
  if (!data.dataByTopic) {
    return;
  }

  const dates = data.dataByTopic[0].dates;
  // date from chart
  const startFromChart = data.dataByTopic[0].dates[0].date;
  const lastFromChart = data.dataByTopic[0].dates[dates.length - 1].date;

  // start date from chart same as date range from, then go ahead keep it
  if (dateOutOfStartBounds(dateFrom, startFromChart, interval)) {
    data.dataByTopic.forEach((o) => {
      o.dates = o.dates.filter((d) => d.date !== startFromChart);
    });
  }

  // we only eliminate the last incomplete interval
  // this is if the end date of the interval comes after To Date
  if (dateOutOfEndBounds(dateTo, lastFromChart, interval)) {
    data.dataByTopic.forEach((o) => {
      o.dates = o.dates.filter((d) => d.date !== lastFromChart);
    });
  }
};

export const pruneIncompleteStackedAreaInterval = (
  data,
  dateRange,
  interval
) => {
  const { from: dateFrom, to: dateTo } = dateRange;

  // eslint-disable-next-line no-warning-comments
  // TODO: switch this to structuredClone when JSDOM fixes the issue
  // https://github.com/jsdom/jsdom/issues/3363
  let filteredData = JSON.parse(JSON.stringify(data));
  //  need to rebuild and sort dates in memory
  const dates = [...new Set(filteredData.map((o) => o.date))];
  dates.sort();

  const startFromChart = dates[0];
  const lastFromChart = dates[dates.length - 1];

  // start date from chart same as date range from, then go ahead keep it
  if (dateOutOfStartBounds(dateFrom, startFromChart, interval)) {
    filteredData = filteredData.filter((o) => o.date !== startFromChart);
  }

  if (dateOutOfEndBounds(dateTo, lastFromChart, interval)) {
    filteredData = filteredData.filter((o) => o.date !== lastFromChart);
  }

  return filteredData;
};
