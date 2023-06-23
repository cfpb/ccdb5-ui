import {
  DATE_RANGE_MIN,
  flagFilters,
  knownFilters,
  SLUG_SEPARATOR,
} from '../constants/index';
import Analytics from '../actions/analytics';
import dayjs from 'dayjs';

/**
 * Breaks up '123' to '1 2 3' to help screen readers read digits individually
 * https://thatdevgirl.com/blog/accessibility-phone-number-formatting
 * @param {string} s - the string of digits
 * @returns {string} an expanded string of digits
 */
export function ariaReadoutNumbers(s) {
  return Array.from(s || '').join(' ');
}

/* eslint-disable no-console */

// eslint-disable-next-line complexity
export const calculateDateRange = (minDate, maxDate) => {
  // only check intervals if the end date is today
  // round off the date so the partial times don't mess up calculations
  const today = startOfToday();
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
 * Function to set the limit of the range of a set of numbers
 * @param {number} x - value we are checking
 * @param {number} min - smallest number it can me
 * @param {number} max - biggest number it can be
 * @returns {*}the limited value
 */
export const clamp = (x, min, max) => {
  if (x < min) {
    x = min;
  } else if (x > max) {
    x = max;
  }
  return x;
};

/**
 * Function to set the limit of the range of a set of dates
 * @param {string} x - value we are checking
 * @param {string} min - smallest number it can be
 * @param {string} max - biggest number it can be
 * @returns {*} the limited value
 */
export const clampDate = (x, min, max) => {
  let xDate = new Date(x);
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
 * @param {object} o - the object being tested
 * @param {string} field - the field to check
 * @param {string | object} alternateValue - the value to use in absence
 * @returns {string} the value to use
 */
export const coalesce = (o, field, alternateValue) => {
  if (typeof o !== 'object') {
    return alternateValue;
  }

  return field in o && o[field] ? o[field] : alternateValue;
};

/**
 * Creates a hash from a string
 * @param {string} someString - the string to hash
 * @returns {number} a hashing of the string
 */
export function hashCode(someString) {
  const s = String(someString);
  let hash = 0;
  let i, chr;
  if (s.length === 0) {
    return hash;
  }
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
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
 * @param {object} query - contains values for the filters, etc
 * @returns {boolean} are we enabling the perCap
 */
// eslint-disable-next-line complexity,require-jsdoc
export function enablePer1000(query) {
  const keys = [];
  let filter;
  const allFilters = knownFilters.concat(flagFilters);

  for (let i = 0; i < allFilters.length; i++) {
    filter = allFilters[i];
    // eslint-disable-next-line no-mixed-operators
    if (
      (Array.isArray(query[filter]) && query[filter].length) ||
      query[filter] === true
    ) {
      keys.push(filter);
    }
  }
  const compReceivedFilters = ['company_received_max', 'company_received_min'];
  for (let i = 0; i < compReceivedFilters.length; i++) {
    filter = compReceivedFilters[i];
    if (query[filter]) {
      keys.push(filter);
    }
  }

  if (keys.length) {
    return keys.length === 1 && keys[0] === 'state';
  }

  return true;
}

/**
 * Creates a hash from an object
 * @param {string} o - the object to hash
 * @returns {string} a hashing of the object
 */
export function hashObject(o) {
  return hashCode(JSON.stringify(o));
}
export const normalize = (s) => s.toLowerCase();

/**
 * takes a string and formats it into proper text for an htmd ID
 * Eat at Joe's => eatatjoes
 * @param {string} a - the dirty string Eat at Joe's
 * @returns {string} sanitized string eat-at-joe-s
 */
export const sanitizeHtmlId = (a) => a.replace(/\s+|\W/g, '-').toLowerCase();

export const slugify = (a, b) => a + SLUG_SEPARATOR + b;

/**
 * take in an array or object and clone it as completely new object to remove
 * pointers.  If you .slice() an array of objects, the array is new, but
 * copied objects still point to original objects, you will still have mutations
 * @param {object | Array} input - the thing to copy
 * @returns {object | Array} the copied new thing
 */
export const cloneDeep = (input) => {
  if (typeof input !== 'undefined') {
    JSON.parse(JSON.stringify(input));
  }
  return input;
};

/**
 * Custom sort for array so that selected items appear first, then by doc_count
 * @param {Array} options - input array containing values
 * @param {Array} selected - values
 * @returns {T[]} sorted array
 */
export const sortSelThenCount = (options, selected) => {
  const retVal = (cloneDeep(options) || []).slice();

  /* eslint complexity: ["error", 5] */
  retVal.sort((a, b) => {
    const aSel = selected.indexOf(a.key) !== -1;
    const bSel = selected.indexOf(b.key) !== -1;

    if (aSel && !bSel) {
      return -1;
    }
    if (!aSel && bSel) {
      return 1;
    }

    // Both are selected or not selected
    // Sort by descending doc_count
    return b.doc_count - a.doc_count;
  });

  return retVal;
};

/**
 * Safely format a date
 * @param {Date} date - the date to convert
 * @returns {string} the date formatted for the current locale
 */
export function shortFormat(date) {
  const wrapped = dayjs(date);
  return date ? wrapped.format('M/D/YYYY') : '';
}

/**
 * Convert a date to a truncated ISO-8601 string
 * @param {Date} date - the date to convert
 * @returns {string} the date formatted as yyyy-mm-ddd
 */
export function shortIsoFormat(date) {
  return date ? date.toISOString().substring(0, 10) : '';
}

/**
 * Gets the UTC time for the beginning of the day in the local time zone
 * @returns {Date} midnight today, local
 */
export function startOfToday() {
  if (!Object.prototype.hasOwnProperty.call(window, 'MAX_DATE')) {
    if (
      Object.prototype.hasOwnProperty.call(window, 'complaint_public_metadata')
    ) {
      const { metadata_timestamp: stamp } = window.complaint_public_metadata;
      window.MAX_DATE = new Date(dayjs(stamp).startOf('day').toString());
    } else {
      // eslint-disable-next-line no-console
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
 * Delay the implementation of a function until after a period of time
 * This prevents expensive calls from being made while triggering events are
 * still happening
 * @param {Function} func - a function with an embedded expensive call
 * @param {number} wait - the number of msecs to delay before calling the function
 * @returns {Function} a replacement function to use in place of the original
 */
export function debounce(func, wait) {
  let timer = null;

  const later = (context, args) => {
    timer = null;
    func.apply(context, args);
  };

  return (...theArgs) => {
    if (!timer) {
      timer = setTimeout(later, wait, this, theArgs);
    }
  };
}

// ----------------------------------------------------------------------------
// attribution: lodash.js (Creative Commons License)

/**
 * Binds methods of an object to the object itself, overwriting the existing
 * method
 * @param {object} obj - The object to bind and assign the bound methods to.
 * @param {...(string|string[])} methodNames - The object method names to bind,
 *  specified individually or in arrays.
 * @returns {object} the updated object
 */
export function bindAll(obj, methodNames) {
  const length = methodNames.length;
  for (let i = 0; i < length; i++) {
    const key = methodNames[i];
    obj[key] = obj[key].bind(obj);
  }
  return obj;
}

// ----------------------------------------------------------------------------

/**
 * Makes sure that a URI has host, protocol, etc.
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
 * @param {error} err - the error object from api
 * @returns {{name: string, message: string}} processed error object we can see
 */
export function processErrorMessage(err) {
  return {
    name: err.name,
    message: err.message,
    stack: err.stack,
  };
}

/**
 * Takes in a number and outputs to percentage
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
 * @param {object} bucket - contains key value pairs
 * @returns {string} name of the key that has the buckets
 */
export const getSubKeyName = (bucket) => {
  for (const k in bucket) {
    if (k !== 'trend_period' && bucket[k].buckets) {
      return k;
    }
  }
  return '';
};

/**
 * helper function to take in array parameters from the url, filters, etc and
 * set the values in the processed object
 * @param {object} params - the object from the URL_CHANGED action
 * @param {object} processed - the state we will update with a single value or arr
 * @param {object} arrayParams - the array of strings that we will check against
 */
export const processUrlArrayParams = (params, processed, arrayParams) => {
  arrayParams.forEach((field) => {
    if (typeof params[field] !== 'undefined') {
      if (typeof params[field] === 'string') {
        processed[field] = [params[field]];
      } else {
        processed[field] = params[field];
      }
    }
  });
};

/**
 * gets a filter and its subagg filters
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
 * @param {string} action - GA Action (not redux action)
 * @param {string} label - param used by GA
 */
export const sendAnalyticsEvent = (action, label) => {
  Analytics.sendEvent(Analytics.getDataLayerOptions(action, label));
};

/**
 * Helper function to get the selected class based on two different values
 * @param {string|number|boolean} a - Value 1 to compare
 * @param {string|number|boolean} b - Value 2 to compare
 * @param {string} selectedClassName - The value that should be returned if both are the same
 * @returns {string} The selected class
 */
export const selectedClass = (a, b, selectedClassName = 'selected') => {
  return a === b ? ' ' + selectedClassName : '';
};
