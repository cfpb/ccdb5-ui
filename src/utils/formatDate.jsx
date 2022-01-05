// ----------------------------------------------------------------------------
// Exports
import dayjs from 'dayjs'
import dayjsLocalizedFormat from 'dayjs/plugin/localizedFormat'
import dayjsUtc from 'dayjs/plugin/utc'

dayjs.extend( dayjsLocalizedFormat )
dayjs.extend( dayjsUtc )

/**
 * Function to format/convert a string to format we want
 * @param {(string | object)} uglyDate the input string to convert
 * @returns {string} the cleaned up string in YYYY-MM-DD
 */
export const formatDate = uglyDate =>
  dayjs( new Date( uglyDate ) ).format( 'YYYY-MM-DD' );

/**
 * adjusting dates coming from the charts so the dates are correct
 * @param {(string | object)} dateIn the input string to convert
 * @returns {string} the cleaned up string in MM/DD/YYYY
 */
export const adjustDate = dateIn =>
  dayjs( new Date( dateIn ) ).utc().add( 5.5, 'hours' )

/**
 * Function to format/convert a string to format we want for the model
 * @param {(string | object)} dateIn the input string to convert
 * @returns {string} the cleaned up string in YYYY-MM-DD
 */
export const formatDateModel = dateIn =>
  dayjs( new Date( dateIn ) ).utc().add( 5.5, 'hours' ).format( 'YYYY-MM-DD' );

/**
 * Function to format/convert a string to format we want for the model
 * @param {(string | object)} dateIn the input string to convert
 * @returns {string} the cleaned up string in Jul 4, 2010
 */
export const formatDateLocaleShort = dateIn =>
  dayjs( new Date( dateIn ) ).utc().add( 5.5, 'hours' ).format( 'll' );

/**
 * function to convert and compare 2 strings as dates
 * @param {string} a input date string to compare MM/DD/YYYY or YYYY-MM-DD
 * @param {string} b input date string to compare MM/DD/YYYY or YYYY-MM-DD
 * @returns {boolean} lets us know if date is equal
 */
export const isDateEqual = ( a, b ) =>
  dayjs( new Date( a ) ).isSame( new Date( b ), 'day' );

/**
 * function to convert and compare 2 strings as dates
 * @param {string} a input date string to compare MM/DD/YYYY or YYYY-MM-DD
 * @param {string} b input date string to compare MM/DD/YYYY or YYYY-MM-DD
 * @returns {number} the return of the compared converted values
 */
export const compareDates = ( a, b ) => {
  if ( isDateEqual( a, b ) ) {
    return 0;
  }

  return new Date( a ) < new Date( b ) ? -1 : 1;
};

