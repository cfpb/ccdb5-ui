import dayjs from 'dayjs';
import { API_PLACEHOLDER, DATE_RANGE_MIN } from '../../../constants';
import { stateToQS } from '../../../reducers/query/query-slice';

const DATA_HOST = 'https://files.consumerfinance.gov';

export const FILTER_DOWNLOAD_MAX = 1e5;

export const FILTER_DOWNLOAD_LIMIT_MESSAGE =
  'Filtered option is unavailable as filtered results exceed download limit. Refine your search terms and filters to reduce the number of complaints.';

export const FILTER_DOWNLOAD_EMPTY_MESSAGE =
  'Filtered option is unavailable. You must add search terms or apply filters to download filtered results.';

/**
 * Whether the user has applied search text, non-default dates, or any filters.
 *
 * @param {object} filtersState - filters slice state
 * @param {object} queryState - query slice state
 * @returns {boolean} true when a custom search/filter is active
 */
export function hasAppliedFilters(filtersState, queryState) {
  const hasFilterValue = Object.values(filtersState).some((value) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value),
  );
  const hasSearchText = Boolean(queryState.searchText?.trim());
  const hasDateFilter =
    Boolean(queryState.date_received_min && queryState.date_received_max) &&
    (!dayjs(queryState.date_received_min).isSame(DATE_RANGE_MIN, 'day') ||
      !dayjs(queryState.date_received_max).isSame(
        queryState.dateLastIndexed,
        'day',
      ));

  return hasFilterValue || hasSearchText || hasDateFilter;
}

// ----------------------------------------------------------------------------
// Useful methods

/**
 * Builds the URI for exporting all results as a CSV zip
 *
 * @returns {string} the URI for the full CSV dataset zip
 */
export function buildAllResultsUri() {
  return DATA_HOST + '/ccdb/complaints.csv.zip';
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
