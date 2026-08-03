// ----------------------------------------------------------------------------
// Exports
import dayjs from 'dayjs';
import dayjsUtc from 'dayjs/plugin/utc';

dayjs.extend(dayjsUtc);

/**
 * Function to format/convert a string to format we want
 *
 * @param {(string | object)} uglyDate - the input string to convert
 * @returns {string} the cleaned up string in YYYY-MM-DD
 */
export const formatDate = (uglyDate) => {
  if (!uglyDate || (typeof uglyDate === 'string' && uglyDate.length === 10)) {
    return uglyDate;
  }
  return dayjs(new Date(uglyDate)).format('YYYY-MM-DD');
};

export const formatDisplayDate = (dateString) => {
  return dayjs(new Date(dateString)).utc().format('M/D/YYYY');
};

/**
 * Formats a date as a natural long date, e.g. July 13, 2026
 *
 * @param {(string | object)} dateString - the input date
 * @returns {string} the cleaned up string in Month D, YYYY
 */
export const formatNaturalDate = (dateString) => {
  return dayjs(new Date(dateString)).utc().format('MMMM D, YYYY');
};
/**
 * adjusting dates coming from the charts so the dates are correct
 *
 * @param {(string | object)} dateIn - the input string to convert
 * @returns {string} the cleaned up string in M/D/YYYY
 */
export const adjustDate = (dateIn) =>
  dayjs(new Date(dateIn)).utc().add(5.5, 'hours').format();

/**
 * Function to format/convert a string to format we want for the model
 *
 * @param {(string | object)} dateIn - the input string to convert
 * @returns {string} the cleaned up string in YYYY-MM-DD
 */
export const formatDateModel = (dateIn) =>
  dayjs(new Date(dateIn)).utc().add(5.5, 'hours').format('YYYY-MM-DD');

/**
 * function to convert and compare 2 strings as dates
 *
 * @param {string} date1 - input date string to compare MM/DD/YYYY or YYYY-MM-DD
 * @param {string} date2 - input date string to compare MM/DD/YYYY or YYYY-MM-DD
 * @returns {boolean} lets us know if date is equal
 */
export const isDateEqual = (date1, date2) =>
  dayjs(new Date(date1)).isSame(new Date(date2), 'day');
