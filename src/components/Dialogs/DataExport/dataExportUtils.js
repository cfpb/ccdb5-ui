import dayjs from 'dayjs';
import { API_PLACEHOLDER } from '../../../constants';
import { stateToQS } from '../../../reducers/query/querySlice';
import { formatDisplayDate } from '../../../utils/formatDate';
import { startOfToday } from '../../../utils';

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

/**
 * Splits a date range into monthly chunks (first/last months may be partial).
 *
 * @param {string} dateMin - start date (YYYY-MM-DD)
 * @param {string} dateMax - end date (YYYY-MM-DD)
 * @returns {Array<{from: string, to: string}>} monthly date ranges
 */
export function splitDateRangeByMonth(dateMin, dateMax) {
  const ranges = [];
  let currentStart = dayjs(dateMin);
  const end = dayjs(dateMax);

  while (currentStart.isBefore(end) || currentStart.isSame(end, 'day')) {
    const monthEnd = currentStart.endOf('month');
    const rangeEnd = monthEnd.isBefore(end) ? monthEnd : end;

    ranges.push({
      from: currentStart.format('YYYY-MM-DD'),
      to: rangeEnd.format('YYYY-MM-DD'),
    });

    if (rangeEnd.isSame(end, 'day')) {
      break;
    }

    currentStart = rangeEnd.add(1, 'day');
  }

  return ranges;
}

/**
 * Resolves the effective export date range from query/filter state.
 *
 * @param {object} state - the merged query and filters state
 * @returns {{dateMin: string, dateMax: string}|null} resolved date range
 */
export function resolveExportDateRange(state) {
  const dateLastIndexed = state.dateLastIndexed;
  const dateMax =
    state.date_received_max ||
    (dateLastIndexed ? dayjs(dateLastIndexed).format('YYYY-MM-DD') : startOfToday());
  const dateMin =
    state.date_received_min ||
    dayjs(dateMax).subtract(3, 'years').format('YYYY-MM-DD');

  if (!dateMin || !dateMax) {
    return null;
  }

  return { dateMin, dateMax };
}

/**
 * Builds a filesystem-safe export filename for a monthly chunk.
 *
 * @param {string} format - CSV or JSON
 * @param {string} from - start date (YYYY-MM-DD)
 * @param {string} to - end date (YYYY-MM-DD)
 * @returns {string} suggested download filename
 */
export function buildExportFilename(format, from, to) {
  const extension = format === 'json' ? 'json' : 'csv';
  return `complaints_${from}_to_${to}.${extension}`;
}

/**
 * Downloads an export file with a custom filename when possible.
 *
 * @param {string} uri - export URI
 * @param {string} filename - suggested download filename
 */
export async function downloadExportFile(uri, filename) {
  try {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(objectUrl);
  } catch {
    const link = document.createElement('a');
    link.href = uri;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  }
}

/**
 * Builds export URIs split by month for the current filter parameters.
 *
 * @param {string} format - CSV or JSON
 * @param {number} size - the number of results to export
 * @param {object} state - the merged query and filters state
 * @returns {Array<{label: string, uri: string, filename: string}>} monthly export links
 */
export function buildMonthlyExportUrls(format, size, state) {
  const dateRange = resolveExportDateRange(state);

  if (!dateRange) {
    return [];
  }

  const { dateMin, dateMax } = dateRange;
  const exportState = {
    ...state,
    date_received_min: dateMin,
    date_received_max: dateMax,
  };

  return splitDateRangeByMonth(dateMin, dateMax).map(({ from, to }) => {
    const params = {
      ...exportState,
      date_received_min: from,
      date_received_max: to,
      size,
      format,
      no_aggs: true,
    };

    delete params.from;
    delete params.searchAfter;

    return {
      label: `${formatDisplayDate(from)} – ${formatDisplayDate(to)}`,
      filename: buildExportFilename(format, from, to),
      uri: API_PLACEHOLDER + stateToQS(params),
    };
  });
}
