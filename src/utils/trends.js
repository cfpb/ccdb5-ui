import * as types from '../constants';
import dayjs from 'dayjs';
import { compareDates } from './formatDate';
// ----------------------------------------------------------------------------
export const showCompanyOverLay = (lens, companyFilters, isLoading) => {
  if (isLoading) {
    return false;
  }

  // we need to show the companyOverlay if:
  // lens === 'Company' AND there are no company filters
  if (lens === 'Company') {
    return !companyFilters || companyFilters.length === 0;
  }

  return false;
};

/* eslint-disable-next-line no-extra-parens */
export const getSubLens = (lens) => {
  if (!lens) {
    return '';
  }

  switch (lens) {
    case 'Overview':
      return '';
    case 'Company':
      return 'product';
    default:
      return 'sub_' + lens.toLowerCase();
  }
};

/**
 * helper function to strip out the "Other" data points from stacked area if
 * they don't have any values
 *
 * @param {Array} buckets - contains all of the date points for the stacked area
 * @returns {Array} cleaned up array or not
 */
export const pruneOther = (buckets) => {
  const sumOther = buckets
    .filter((bucket) => bucket.name === 'Other')
    .reduce((prev, cur) => prev + cur.value, 0);

  return sumOther > 0
    ? buckets
    : buckets.filter((bucket) => bucket.name !== 'Other');
};

export const isGreaterThanYear = (from, to) => {
  const fromDay = dayjs(from);
  const toDay = dayjs(to);
  return toDay.diff(fromDay, 'days') > 366;
};

/**
 * gets the valid intervals based on dates selected.
 * get rid of Day if range > 1yr
 *
 * @param {object} from - date
 * @param {object} to - date
 * @returns {Array} array of date intervals
 */
export const getIntervals = (from, to) =>
  types.dateIntervals.map((interval) => ({
    name: interval,
    disabled: isGreaterThanYear(from, to) && interval === 'Day',
  }));

/**
 * trigger this after a user clicks a focus.  we scroll to the select box
 * so that users don't get a blank wall of content
 */
export const scrollToFocus = () => {
  const lensSelect = document.getElementById('search-summary');
  if (lensSelect) {
    lensSelect.scrollIntoView();
  }
};

/**
 * helper function that takes the flat data format and converts to britecharts
 * line chart format that groups by dataByTopic
 *
 * @param {Array} inputArray - the flat data containing value, name, date
 * @returns {object} object containing grouped topics with date array
 */
export function convertToLineFormat(inputArray) {
  if (!inputArray) {
    return [];
  }
  const results = {
    dataByTopic: [],
  };

  // get all topics/lines first
  const keyNames = new Set(inputArray.map((key) => key.name));
  keyNames.forEach((key) => {
    results.dataByTopic.push({
      dates: inputArray
        .filter((datum) => datum.name === key)
        .map((item) => ({ value: item.value, date: item.date }))
        .sort((first, second) => compareDates(first.date, second.date)),
      topic: key,
      topicName: key,
      // hide "Other" line, but we still need it for tooltip processing
      show: key !== 'Other',
    });
  });

  return results;
}
