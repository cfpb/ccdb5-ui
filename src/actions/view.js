import { REQUERY_NEVER } from '../constants';

export const MAP_WARNING_DISMISSED = 'MAP_WARNING_DISMISSED';
export const TRENDS_DATE_WARNING_DISMISSED = 'TRENDS_DATE_WARNING_DISMISSED';

// ----------------------------------------------------------------------------
// Simple actions

/**
 * Notifies the application that user dismissed map warning
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function mapWarningDismissed() {
  return {
    type: MAP_WARNING_DISMISSED,
    requery: REQUERY_NEVER,
  };
}

/**
 * Notifies the application that user dismissed trends date warning
 * @returns {string} a packaged payload to be used by Redux reducers
 */
export function trendsDateWarningDismissed() {
  return {
    type: TRENDS_DATE_WARNING_DISMISSED,
    requery: REQUERY_NEVER,
  };
}
