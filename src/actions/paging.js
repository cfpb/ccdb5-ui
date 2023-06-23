import { REQUERY_HITS_ONLY } from '../constants';

export const NEXT_PAGE_SHOWN = 'NEXT_PAGE_SHOWN';
export const PREV_PAGE_SHOWN = 'PREV_PAGE_SHOWN';
export const SIZE_CHANGED = 'SIZE_CHANGED';
export const SORT_CHANGED = 'SORT_CHANGED';

// ----------------------------------------------------------------------------
// Simple actions
/**
 * Notifies the application that the page has changed
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function nextPageShown() {
  return {
    type: NEXT_PAGE_SHOWN,
    requery: REQUERY_HITS_ONLY,
  };
}

/**
 * Notifies the application that the page has changed
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function prevPageShown() {
  return {
    type: PREV_PAGE_SHOWN,
    requery: REQUERY_HITS_ONLY,
  };
}

/**
 * Notifies the application that the size of a page of results has changed
 * @param {number} size - the new size of a page
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function changeSize(size) {
  // eslint-disable-next-line no-console
  console.assert(typeof size === 'number');
  return {
    type: SIZE_CHANGED,
    size,
    requery: REQUERY_HITS_ONLY,
  };
}

/**
 * Notifies the application that the sort order of results has changed
 * @param {string} sort - the new sort.  Should match a value expected by the API
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function changeSort(sort) {
  return {
    type: SORT_CHANGED,
    sort,
    requery: REQUERY_HITS_ONLY,
  };
}
