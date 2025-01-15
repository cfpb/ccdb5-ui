import {
  DATE_RANGE_MIN,
  flagFilters,
  knownFilters,
  SLUG_SEPARATOR,
} from '../constants/index';
import Analytics from '../actions/analytics';
import dayjs from 'dayjs';
import queryString from 'query-string';

/**
 * Breaks up '123' to '1 2 3' to help screen readers read digits individually
 * https://thatdevgirl.com/blog/accessibility-phone-number-formatting
 *
 * @param {string} digits - the string of digits
 * @returns {string} an expanded string of digits
 */
export function ariaReadoutNumbers(digits) {
  return Array.from(digits || '').join(' ');
}

/* eslint-disable no-console */

// eslint-disable-next-line complexity
export const calculateDateRange = (minDate, maxDate) => {
  // only check intervals if the end date is today
  // round off the date so the partial times don't mess up calculations
  const today = dayjs(startOfToday());
  const end = dayjs(maxDate).startOf('day');
  const start = dayjs(minDate).startOf('day');

  // make sure end date is the same as today's date
  if (end.diff(today, 'days') !== 0) {
    return '';
  }

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
  } else if (Math.min(number, boundOne) === number) {
    return boundOne;
  } else if (Math.max(number, boundTwo) === number) {
    return boundTwo;
  }
  return number;
};

/**
 * Function to set the limit of the range of a set of dates
 *
 * @param {string} val - value we are checking
 * @param {string} min - smallest number it can be
 * @param {string} max - biggest number it can be
 * @returns {*} the limited value
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

  return field in object && object[field] ? object[field] : alternateValue;
};

/**
 * Creates a hash from a string
 *
 * @param {string} someString - the string to hash
 * @returns {number} a hashing of the string
 */
export function hashCode(someString) {
  const str = String(someString);
  let hash = 0;
  let index, chr;
  if (str.length === 0) {
    return hash;
  }
  for (index = 0; index < str.length; index++) {
    chr = str.charCodeAt(index);
    hash = (hash << 5) - hash + chr;

    // Convert to 32bit integer
    hash |= 0;
  }
  return hash;
}

/**
 * helper function to determine if we have any filters selected so we can
 * disable the Per 1000 Complaints button
 * enable per1000 if the only filter selected is state
 *
 * @param {object} filters - reducer contains values for the filters, etc
 * @returns {boolean} are we enabling the perCap
 */
// eslint-disable-next-line complexity
export function enablePer1000(filters) {
  const keys = [];
  let filter;
  const allFilters = knownFilters.concat(flagFilters);

  for (let index = 0; index < allFilters.length; index++) {
    filter = allFilters[index];

    if (
      (Array.isArray(filters[filter]) && filters[filter].length) ||
      filters[filter] === true
    ) {
      keys.push(filter);
    }
  }
  const compReceivedFilters = ['company_received_max', 'company_received_min'];
  for (let index = 0; index < compReceivedFilters.length; index++) {
    filter = compReceivedFilters[index];
    if (filters[filter]) {
      keys.push(filter);
    }
  }

  if (keys.length) {
    // normalization still okay as long as only State filters are applied
    return keys.length === 1 && keys[0] === 'state';
  }

  return true;
}

export const normalize = (str) => str.toLowerCase();

/**
 * takes a string and formats it into proper text for an htmd ID
 * Eat at Joe's => eatatjoes
 *
 * @param {string} str - the dirty string Eat at Joe's
 * @returns {string} sanitized string eat-at-joe-s
 */
export const sanitizeHtmlId = (str) =>
  str.replace(/\s+|\W/g, '-').toLowerCase();

export const slugify = (first, second) => first + SLUG_SEPARATOR + second;

/**
 * Custom sort for array so that selected items appear first, then by doc_count
 *
 * @param {Array} options - input array containing values
 * @param {Array} selected - values
 * @returns {Array} sorted array
 */
export const sortSelThenCount = (options, selected) => {
  const retVal = (structuredClone(options) || []).slice();

  /* eslint complexity: ["error", 5] */
  retVal.sort((first, second) => {
    const aSel = selected.indexOf(first.key) !== -1;
    const bSel = selected.indexOf(second.key) !== -1;

    if (aSel && !bSel) {
      return -1;
    }
    if (!aSel && bSel) {
      return 1;
    }

    // Both are selected or not selected
    // Sort by descending doc_count
    return second.doc_count - first.doc_count;
  });

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
  } else if (typeof date === 'object' && date !== null) {
    return dayjs(date).toISOString().slice(0, 10);
  }
  return '';
}

/**
 * Gets the UTC time for the beginning of the day in the local time zone
 *
 * @returns {string} midnight today, local
 */
export function startOfToday() {
  if (!Object.prototype.hasOwnProperty.call(window, 'MAX_DATE')) {
    if (
      Object.prototype.hasOwnProperty.call(window, 'complaint_public_metadata')
    ) {
      const { metadata_timestamp: stamp } = window.complaint_public_metadata;
      window.MAX_DATE = new Date(dayjs(stamp).startOf('day').toString());
    } else {
      console.error('complaint_public_metadata is missing');
      window.MAX_DATE = new Date(dayjs().startOf('day').toString());
    }
  }

  // Always return a clone so the global is not exposed or changed
  return new Date(window.MAX_DATE.valueOf());
}

// ----------------------------------------------------------------------------
// attribution: underscore.js (MIT License)

/**
 * Native implementation of lodash debounce
 * https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_debounce
 *
 * @param {Function} func - The function to run.
 * @param {number} wait - Time in milliseconds.
 * @param {boolean} immediate - Whether we should run function immedately.
 * @returns {Function} the debounced function
 */
export function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
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
 * processes error messages so we can see them in redux
 *
 * @param {Error} err - the error object from api
 * @returns {{name: string, message: string}} processed error object we can see
 */
export function processErrorMessage(err) {
  return {
    name: err.name,
    message: err.message,
  };
}

/**
 * Takes in a number and outputs to percentage
 *
 * @param {number} num - value we convert .9999
 * @returns {number} 99.99
 */
export function formatPercentage(num) {
  // we have to do this so it is a float and not a string
  const val = parseFloat(parseFloat(num * 100).toFixed(2));
  return isNaN(val) ? 0.0 : val;
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
  arrayParams.forEach((field) => {
    if (typeof params[field] !== 'undefined') {
      if (typeof params[field] === 'string') {
        state[field] = [params[field]];
      } else {
        state[field] = params[field];
      }
    }
  });

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
 * @returns {Set<any>} returns a set of uniques Debt, Debt*Foo
 */
export const getAllFilters = (filterKey, subitems) => {
  const values = new Set();
  // Add the parent
  values.add(filterKey);
  // Add the shown subitems
  subitems.forEach((sub) => {
    values.add(slugify(filterKey, sub.key));
  });
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
  const myObject = Object.keys(object).reduce((acc, key) => {
    if (
      object[key] !== null &&
      object[key] !== undefined &&
      object[key] !== '' &&
      !Number.isNaN(object[key])
    ) {
      acc[key] = object[key];
    }
    return acc;
  }, {});

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
