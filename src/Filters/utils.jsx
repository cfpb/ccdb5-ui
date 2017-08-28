import { SLUG_SEPARATOR } from '../constants'

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
  return date ? date.toLocaleDateString() : ''
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
