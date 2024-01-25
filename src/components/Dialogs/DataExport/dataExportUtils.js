import { API_PLACEHOLDER } from '../../../constants';
import { stateToQS } from '../../../reducers/query/query';

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

  return API_PLACEHOLDER + stateToQS(params);
}
