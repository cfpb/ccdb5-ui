import moment from 'moment'
import { SLUG_SEPARATOR } from './constants'

export const normalize = s => s.toLowerCase()

export const slugify = ( a, b ) => a + SLUG_SEPARATOR + b

export const sortSelThenCount = ( options, selected ) => {
  const retVal = ( options || [] ).slice()

  // Sort the array so that selected items appear first, then by doc_count
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
