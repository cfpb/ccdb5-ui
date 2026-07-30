import { API_PLACEHOLDER } from '../../../constants';
import { stateToQS } from '../../../reducers/query/query-slice';

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
 * Builds the URI for exporting filtered results as CSV
 *
 * @param {number} size - the number of results to export
 * @param {object} state - the merged query and filters state
 * @returns {string} the URI for the filtered CSV export
 */
export function buildSomeResultsUri(size, state) {
  const params = { ...state , size: size, format: 'csv', no_aggs: true,};


  // Remove unnecessary pagination query params
  delete params.from;
  delete params.searchAfter;

  return API_PLACEHOLDER + stateToQS(params);
}
