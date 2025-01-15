import { API_PLACEHOLDER } from '../../../constants';
import { stateToQS } from '../../../reducers/query/querySlice';

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
 * @param {object} state - the merged query and filters state
 * @returns {string} the URI for the specific type of format
 */
export function buildSomeResultsUri(format, size, state) {
  const params = { ...state };

  params.size = size;
  params.format = format;

  params.no_aggs = true;

  // Remove unnecessary pagination query params
  delete params.from;
  delete params.searchAfter;

  return API_PLACEHOLDER + stateToQS(params);
}
