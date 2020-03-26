import {
  DATE_RANGE_MIN, flagFilters, knownFilters, SLUG_SEPARATOR
} from './constants'
import moment from 'moment'

/**
* Breaks up '123' to '1 2 3' to help screen readers read digits individually
* https://thatdevgirl.com/blog/accessibility-phone-number-formatting
*
* @param {string} s the string of digits
* @returns {string} an expanded string of digits
*/
export function ariaReadoutNumbers( s ) {
  return Array.from( s || '' ).join( ' ' )
}

// eslint-disable-next-line complexity
export const calculateDateInterval = ( minDate, maxDate ) => {
  // only check intervals if the end date is today
  // round off the date so the partial times don't mess up calculations
  const today = moment( new Date() ).startOf( 'day' )
  const end = moment( maxDate ).startOf( 'day' )
  const start = moment( minDate ).startOf( 'day' )

  // make sure end date is the same as today's date
  if ( end.diff( today, 'days', true ) !== 0 ) {
    return ''
  }

  // is the start date the same as the oldest document?
  if ( moment( minDate ).isSame( DATE_RANGE_MIN, 'day' ) ) {
    return 'All'
  }

  // verify if it's 3 or 1 years
  const yrDiff = end.diff( start, 'years', true )

  if ( yrDiff === 3 || yrDiff === 1 ) {
    return yrDiff + 'y'
  }

  // verify if it's 6 or 3 months
  const moDiff = end.diff( start, 'months', true )
  if ( moDiff === 6 || moDiff === 3 ) {
    return moDiff + 'm'
  }

  return ''
}

/**
 * Function to set the limit of the range of a set of numbers
 * @param {int} x value we are checking
 * @param {int} min smallest number it can me
 * @param {int} max biggest number it can be
 * @returns {*}the limited value
 */
export const clamp = ( x, min, max ) => {
  if ( x < min ) {
    x = min;
  } else if ( x > max ) {
    x = max;
  }
  return x;
}

/**
 * Replacement for the common pattern:
 * if( o.field )
 *    x = o.field
 * else
 *    x = alternateValue
 *
 * Avoids some of the complexity lint warnings
 *
 * @param {Object} o the object being tested
 * @param {string} field the field to check
 * @param {string|Object} alternateValue the value to use in absence
 * @returns {string} the value to use
 */
export const coalesce = ( o, field, alternateValue ) => {
  if ( typeof o !== 'object' ) {
    return alternateValue;
  }

  return field in o && o[field] ? o[field] : alternateValue;
};

/**
 * Creates a hash from a string
 *
 * @param {string} someString the string to hash
 * @returns {int} a hashing of the string
 */
export function hashCode( someString ) {
  const s = String( someString )
  let hash = 0
  let i, chr
  if ( s.length === 0 ) {
    return hash
  }
  for ( i = 0; i < s.length; i++ ) {
    chr = s.charCodeAt( i )
    hash = ( hash << 5 ) - hash + chr

    // Convert to 32bit integer
    hash |= 0
  }
  return hash
}

/**
 * helper function to determine if we have any filters selected so we can
 * disable the Per 1000 Complaints button
 * @param {object} query contains values for the filters, etc
 * @returns {boolean} are we enabling the perCap
 */
// eslint-disable-next-line complexity
export function hasFiltersEnabled( query ) {
  const keys = []
  let filter
  const allFilters = knownFilters.concat( flagFilters )

  for ( let i = 0; i < allFilters.length; i++ ) {
    filter = allFilters[i]
    // eslint-disable-next-line no-mixed-operators
    if ( Array.isArray( query[filter] ) && query[filter].length ||
      query[filter] === true ) {
      keys.push( filter )
    }
  }
  const compReceivedFilters = [ 'company_received_max', 'company_received_min' ]
  for ( let i = 0; i < compReceivedFilters.length; i++ ) {
    filter = compReceivedFilters[i]
    if ( query[filter] ) {
      keys.push( filter )
    }
  }
  return keys.length > 0
}

/**
 * Creates a hash from an object
 *
 * @param {string} o the object to hash
 * @returns {string} a hashing of the object
 */
export function hashObject( o ) {
  return hashCode( JSON.stringify( o ) )
}
export const normalize = s => s.toLowerCase()

export const slugify = ( a, b ) => a + SLUG_SEPARATOR + b

export const sortSelThenCount = ( options, selected ) => {
  const retVal = ( options || [] ).slice()

  // Sort the array so that selected items appear first, then by doc_count
  /* eslint complexity: ["error", 5] */
  retVal.sort( ( a, b ) => {
    const aSel = selected.indexOf( a.key ) !== -1
    const bSel = selected.indexOf( b.key ) !== -1

    if ( aSel && !bSel ) {
      return -1;
    }
    if ( !aSel && bSel ) {
      return 1;
    }

    // Both are selected or not selected
    // Sort by descending doc_count
    return b.doc_count - a.doc_count
  } )

  return retVal
}

/**
* Safely format a date
*
* @param {Date} date the date to convert
* @returns {string} the date formatted for the current locale
*/
export function shortFormat( date ) {
  const wrapped = moment( date )
  return date ? wrapped.format( 'M/D/YYYY' ) : ''
}

/**
* Convert a date to a truncated ISO-8601 string
*
* @param {Date} date the date to convert
* @returns {string} the date formatted as yyyy-mm-ddd
*/
export function shortIsoFormat( date ) {
  return date ? date.toISOString().substring( 0, 10 ) : ''
}

// ----------------------------------------------------------------------------
// attribution: underscore.js (MIT License)

/**
* Delay the implementation of a function until after a period of time
* This prevents expensive calls from being made while triggering events are
* still happening
*
* @param {function} func a function with an embedded expensive call
* @param {int} wait the number of msecs to delay before calling the function
* @returns {function} a replacement function to use in place of the original
*/
export function debounce( func, wait ) {
  var timer = null;

  var later = ( context, args ) => {
    timer = null;
    func.apply( context, args );
  }

  return ( ...theArgs ) => {
    if ( !timer ) {
      timer = setTimeout( later, wait, this, theArgs )
    }
  }
}

// ----------------------------------------------------------------------------
// attribution: lodash.js (Creative Commons License)

/**
* Binds methods of an object to the object itself, overwriting the existing
* method
*
* @param {Object} obj The object to bind and assign the bound methods to.
* @param {...(string|string[])} methodNames The object method names to bind,
*  specified individually or in arrays.
* @returns {Object} the updated object
*/
export function bindAll( obj, methodNames ) {
  const length = methodNames.length
  for ( let i = 0; i < length; i++ ) {
    const key = methodNames[i]
    obj[key] = obj[key].bind( obj )
  }
  return obj;
}

// ----------------------------------------------------------------------------

/**
* Makes sure that a URI has host, protocol, etc.
*
* @param {string} uri the uri to test
* @returns {string} a uri with the protocol, host and port if necessary
*/
export function getFullUrl( uri ) {
  if ( !uri ) return uri;

  // https://gist.github.com/jlong/2428561
  const parser = document.createElement( 'a' );
  parser.href = uri;
  return parser.href
}

