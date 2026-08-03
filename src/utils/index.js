import { DATE_RANGE_MIN, SLUG_SEPARATOR } from '../constants/index';
import Analytics from '../actions/analytics';
import dayjs from 'dayjs';
import queryString from 'query-string';
import { formatDate } from './format-date';

/**
 * Breaks up '123' to '1 2 3' to help screen readers read digits individually
 * https://thatdevgirl.com/blog/accessibility-phone-number-formatting
 *
 * @param {string} digits - the string of digits
 * @returns {string} an expanded string of digits
 */
export function ariaReadoutNumbers(digits) {
  return [...(digits || '')].join(' ');
}

export const calculateDateRange = (minDate, maxDate, dateLastIndexed) => {
  // only check intervals if the end date is today
  // round off the date so the partial times don't mess up calculations
  const today = dateLastIndexed ? dayjs(dateLastIndexed) : startOfToday();
  const end = dayjs(maxDate).startOf('day');

  // make sure end date is the same as today's date
  if (end.diff(today, 'days') !== 0) {
    return '';
  }

  const start = dayjs(minDate).startOf('day');

  // is the start date the same as the oldest document?
  if (dayjs(minDate).isSame(DATE_RANGE_MIN, 'day')) {
    return 'All';
  }

  // verify if it's 3 or 1 years
  const yrDiff = end.diff(start, 'years', true);
  if (yrDiff === 3 || yrDiff === 1) {
    return yrDiff + 'y';
  }

  // verify if it's 6 or 3 months
  const moDiff = end.diff(start, 'months', true);
  if (moDiff === 6 || moDiff === 3) {
    return moDiff + 'm';
  }

  return '';
};

/**
 * Takes a string and returns a string with the first letter capitalized
 *
 * @param {string} string - the string to capitalize
 * @returns {string} the string with the first letter capitalized
 */
export const capitalize = (string) => {
  if (typeof string !== 'string' || string.length === 0) {
    return string; // Return original if not a string or empty
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Clamps number within the inclusive lower and upper bounds.
 * https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_clamp
 *
 * @param {number} number - The value we are checking.
 * @param {number} boundOne - The lower bound we don't want to go before.
 * @param {number} boundTwo - The upper bound we can't go past.
 * @returns {number} The clamped number.
 */
export const clamp = (number, boundOne, boundTwo) => {
  if (!boundTwo) {
    return Math.max(number, boundOne) === boundOne ? boundOne : number;
  }
  if (Math.min(number, boundOne) === number) {
    return boundOne;
  }
  if (Math.max(number, boundTwo) === number) {
    return boundTwo;
  }
  return number;
};

/**
 * Function to limit the range (max/min) of a set of dates
 *
 * @param {string} val - value we are checking
 * @param {string} min - earliest date it can be
 * @param {string} max - oldest date it can be
 * @returns {Date} the limited value
 */
export const clampDate = (val, min, max) => {
  let xDate = new Date(val);
  const minDate = new Date(min);
  const maxDate = new Date(max);

  if (xDate < minDate) {
    xDate = minDate;
  } else if (xDate > maxDate) {
    xDate = maxDate;
  }
  return xDate;
};

/**
 * Replacement for the common pattern:
 * if( o.field )
 * x = o.field
 * else
 * x = alternateValue
 *
 * Avoids some of the complexity lint warnings
 *
 * @param {object} object - the object being tested
 * @param {string} field - the field to check
 * @param {string | object} alternateValue - the value to use in absence
 * @returns {string | Array | object} the value to use
 */
export const coalesce = (object, field, alternateValue) => {
  if (typeof object !== 'object') {
    return alternateValue;
  }

  if (!Object.hasOwn(object, field)) {
    return alternateValue;
  }

  const value = object[field];
  return value || alternateValue;
};

export const normalize = (str) => str.toLowerCase();

/**
 * Helper function to check if any element in the array is truthy
 *
 * @param {Array} argArray - array of parameters to check against
 * @returns {boolean} whether or not any value in the array is true
 */
export const isTrue = (argArray) => argArray.some((element) => !!element);

/**
 * takes a string and formats it into proper text for an htmd ID
 * Eat at Joe's => eatatjoes
 *
 * @param {string} str - the dirty string Eat at Joe's
 * @returns {string} sanitized string eat-at-joe-s
 */
export const sanitizeHtmlId = (str) =>
  str
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-+|-+$/g, '');

export const slugify = (first, second) => first + SLUG_SEPARATOR + second;

export const insertParentFilter = (filterArray, missingFilter, fieldName) => {
  if (filterArray.every((item) => item.key !== missingFilter)) {
    filterArray.push({
      key: missingFilter,
      doc_count: 0,
      [`sub_${fieldName}.raw`]: {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [],
      },
    });
  }
};

export const insertChildFilter = (filterArray, missingFilter, fieldName) => {
  const filter = filterArray.find(
    (item) => item.key === missingFilter.split(SLUG_SEPARATOR)[0],
  );
  const subAggField = `sub_${fieldName}.raw`;
  if (!Object.hasOwn(filter, subAggField)) {
    return;
  }
  const subAgg = filter[subAggField];
  if (
    subAgg &&
    subAgg.buckets.every(
      (bucket) => bucket.key !== missingFilter.split(SLUG_SEPARATOR)[1],
    )
  ) {
    subAgg.buckets.push({
      key: missingFilter.split(SLUG_SEPARATOR)[1],
      doc_count: 0,
    });
  }
};

/**
 * Custom sort for filters:
 * - selected parent items appear first
 * - then selected child items
 * - then by doc_count
 *
 * @param {Array} options - filter options
 * @param {Array} filters - filter state from redux
 * @param {string} fieldName - the filter field
 * @returns {Array} Sorted filters
 */
export const sortOptions = (options, filters, fieldName) => {
  const selectedFilters = filters || [];
  const subAggFieldName = `sub_${fieldName}.raw`;
  const retVal = [...(structuredClone(options) || [])];
  return retVal.toSorted((first, second) => {
    // sort by parent items first
    const isFirstItemSelected = selectedFilters.includes(first.key);
    const isSecondItemSelected = selectedFilters.includes(second.key);
    // If items have different selection status
    if (isFirstItemSelected !== isSecondItemSelected) {
      return isFirstItemSelected ? -1 : 1;
    }

    const isFirstItemChildSelected = (() => {
      if (!first || !Object.hasOwn(first, subAggFieldName)) {
        return false;
      }
      const subAgg = first[subAggFieldName];
      return subAgg
        ? subAgg.buckets.some((bucket) =>
            selectedFilters.includes(first.key + SLUG_SEPARATOR + bucket.key),
          )
        : false;
    })();

    const isSecondItemChildSelected = (() => {
      if (!second || !Object.hasOwn(second, subAggFieldName)) {
        return false;
      }
      const subAgg = second[subAggFieldName];
      return subAgg
        ? subAgg.buckets.some((bucket) =>
            selectedFilters.includes(second.key + SLUG_SEPARATOR + bucket.key),
          )
        : false;
    })();
    // then try sorting if parent item has any child selected
    if (isFirstItemChildSelected !== isSecondItemChildSelected) {
      return isFirstItemChildSelected ? -1 : 1;
    }

    // Both items have the same selection status
    // Sort by descending doc_count
    return second.doc_count - first.doc_count;
  });
};

/**
 * Sorts and inserts missing filter options
 *
 * @param {Array} options - filter vals from aggregations api call
 * @param {Array} selectedFilters - parent values from Filter Reducer
 * @param {string} fieldName - the field to grab subaggregations, product or issue
 * @returns {Array} sorted array
 */
export const sortSelThenCount = (options, selectedFilters, fieldName) => {
  const retVal = sortOptions(options, selectedFilters, fieldName);
  // insert any missing filters from Product / Issue
  if (selectedFilters.length > 0) {
    for (const item of selectedFilters) {
      if (item.includes(SLUG_SEPARATOR)) {
        insertParentFilter(retVal, item.split(SLUG_SEPARATOR)[0], fieldName);
        insertChildFilter(retVal, item, fieldName);
      } else {
        insertParentFilter(retVal, item, fieldName);
      }
    }
  }
  return retVal;
};

/**
 * Safely format a date
 *
 * @param {Date} date - the date to convert
 * @returns {string} the date formatted for the current locale
 */
export function shortFormat(date) {
  const wrapped = dayjs(date);
  return date ? wrapped.format('M/D/YYYY') : '';
}

/**
 * Convert a date to a truncated ISO-8601 string
 *
 * @param {string | object | Date} date - the date to convert
 * @returns {string} the date formatted as yyyy-mm-ddd
 */
export function shortIsoFormat(date) {
  if (typeof date === 'string') {
    return date.slice(0, 10);
  }
  if (typeof date === 'object' && date !== null) {
    return dayjs(date).toISOString().slice(0, 10);
  }
  return '';
}

/**
 * This value gets set in the querySlice reducer listening to RTKQuery getMeta hook
 */
const maxDateState = { value: null };

/**
 * @param {string} date - midnight today (or last indexed day), local
 */
export function setMaxDate(date) {
  maxDateState.value = date;
}

/**
 * @returns {string} midnight today, local
 */
export function startOfToday() {
  if (!maxDateState.value) {
    // eslint-disable-next-line no-console
    console.error('waiting for API response, setting MAX_DATE to today');
    maxDateState.value = formatDate(dayjs().startOf('day'));
  }
  return maxDateState.value;
}

// ----------------------------------------------------------------------------
// attribution: underscore.js (MIT License)

/**
 * Native implementation of lodash debounce
 * https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_debounce
 *
 * @template {(...args: unknown[]) => unknown} F
 * @param {F} func - The function to run.
 * @param {number} wait - Time in milliseconds.
 * @param {boolean} [immediate] - Whether we should run function immediately.
 * @returns {(...args: Parameters<F>) => void} The debounced function
 */
export function debounce(func, wait, immediate) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func(...args);
    }, wait);
    if (immediate && !timeout) func(...args);
  };
}

/**
 * Makes sure that a URI has host, protocol, etc.
 *
 * @param {string} uri - the uri to test
 * @returns {string} a uri with the protocol, host and port if necessary
 */
export function getFullUrl(uri) {
  if (!uri) return uri;

  // https://gist.github.com/jlong/2428561
  const parser = document.createElement('a');
  parser.href = uri;
  return parser.href;
}

/**
 * helper function
 *
 * @param {object} bucket - contains key value pairs
 * @returns {string} name of the key that has the buckets
 */
export const getSubKeyName = (bucket) => {
  for (const item in bucket) {
    if (item !== 'trend_period' && bucket[item].buckets) {
      return item;
    }
  }
  return '';
};

/**
 * helper function to take in array parameters from the url, filters, etc and
 * set the values in the processed object
 *
 * @param {object} params - the object from the URL_CHANGED action
 * @param {object} state - the state we will update with a single value or arr
 * @param {object} arrayParams - the array of strings that we will check against
 */
export const processUrlArrayParams = (params, state, arrayParams) => {
  for (const field of arrayParams) {
    if (params[field] !== undefined) {
      state[field] =
        typeof params[field] === 'string' ? [params[field]] : params[field];
    }
  }

  if (params.has_narrative) {
    state.has_narrative = !!params.has_narrative;
  } else {
    delete state.has_narrative;
  }
};

/**
 * gets a filter and its subagg filters
 *
 * @param {string} filterKey - the filter 'Debt'
 * @param {Array} subitems - the buckets to process to generate slug
 * @returns {Set<string>} returns a set of uniques Debt, Debt*Foo
 */
export const getAllFilters = (filterKey, subitems) => {
  const values = new Set([filterKey]);
  // Add the parent
  // Add the shown subitems
  for (const sub of subitems) {
    values.add(slugify(filterKey, sub.key));
  }
  return values;
};

/**
 * Wrapper around analytics event action creator to minimize the copypasta
 *
 * @param {string} action - GA Action (not redux action)
 * @param {string} label - param used by GA
 */
export const sendAnalyticsEvent = (action, label) => {
  Analytics.sendEvent(Analytics.getDataLayerOptions(action, label));
};

/**
 * Helper function to get the selected class based on two different values
 *
 * @param {string|number|boolean} first - Value 1 to compare
 * @param {string|number|boolean} second - Value 2 to compare
 * @param {string} selectedClassName - The value that should be returned if both are the same
 * @returns {string} The selected class
 */
export const selectedClass = (
  first,
  second,
  selectedClassName = 'selected',
) => {
  return first === second ? ' ' + selectedClassName : '';
};

/**
 * Remove all properties with the value 'null' from the object, or empty string
 *
 * @param {object} object - the object with potential nulls
 * @returns {object} the processed object
 */
export function removeNullProperties(object) {
  const myObject = {};
  for (const [key, value] of Object.entries(object)) {
    if (
      value !== null &&
      value !== undefined &&
      value !== '' &&
      !Number.isNaN(value)
    ) {
      myObject[key] = value;
    }
  }

  for (const key in myObject) {
    if (Array.isArray(myObject[key]) && myObject[key].length === 0) {
      delete myObject[key];
    }
  }

  return myObject;
}

/**
 * Builds a URL from a path and dictionary
 *
 * @param {string} path - The V2 endpoint.
 * @param {object} params - A key/value pair of the query string params.
 * @returns {string} The full endpoint url.
 */
export function formatUri(path, params) {
  return path + '?' + queryString.stringify(params);
}
