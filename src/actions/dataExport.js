// Tip of the hat to:
// https://stackoverflow.com/questions/35623656
// https://stackoverflow.com/questions/3916191

import { buildLink, simulateClick } from './domUtils';
import { MODAL_SHOWN, MODAL_TYPE_DATA_EXPORT } from '../constants';
import { stateToQS } from '../reducers/query/query';

const DATA_HOST = 'https://files.consumerfinance.gov';

// ----------------------------------------------------------------------------
// Useful methods

/**
 * Builds the URI for exporting all results
 *
 * @param {string} format - CSV or JSON
 * @returns {string} the URI for the specific type of format
 */
export function buildAllResultsUri(format) {
  return DATA_HOST + '/ccdb/complaints.' + format + '.zip';
}

/**
 * Builds the URI for exporting some results
 *
 * @param {string} format - CSV or JSON
 * @param {number} size - the number of results to export
 * @param {object} queryState - the current state of the query reducer
 * @returns {string} the URI for the specific type of format
 */
export function buildSomeResultsUri(format, size, queryState) {
  const params = { ...queryState };

  params.size = size;
  params.format = format;
  // eslint-disable-next-line camelcase
  params.no_aggs = true;

  return '@@API' + stateToQS(params);
}

// ----------------------------------------------------------------------------
// Action Creators

/**
 * Notifies the application that the export dialog box should appear
 *
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function showExportDialog() {
  return {
    type: MODAL_SHOWN,
    modalType: MODAL_TYPE_DATA_EXPORT,
    modalProps: {},
  };
}

/**
 * Call the URL that contains the entire dataset
 *
 * @param {string} format - JSON or CSV
 * @returns {Function} a set of steps to execute
 */
export function exportAllResults(format) {
  return () => {
    const uri = buildAllResultsUri(format);
    const link = buildLink(uri, 'download.' + format);
    simulateClick(link);
  };
}

/**
 * Call the export endpoint of the API with the current filter criteria
 *
 * @param {string} format - JSON or CSV
 * @param {number} size - The number of rows in the dataset
 * @returns {Function} a set of steps to execute
 */
export function exportSomeResults(format, size) {
  return (_, getState) => {
    const uri = buildSomeResultsUri(format, size, getState().query);
    const link = buildLink(uri, 'download.' + format);
    simulateClick(link);
  };
}
