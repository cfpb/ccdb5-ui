import * as analytics from './analytics';
import * as complaints from './complaints';
import * as paging from './paging';
import * as search from './search';
import * as trends from './trends';
import * as url from './url';

/**
 * Aggregates all the known actions into one importable object
 * @returns {object} a merged object of all available actions
 */
function combineActions() {
  return {
    ...analytics,
    ...complaints,
    ...paging,
    ...search,
    ...trends,
    ...url,
  };
}

export default combineActions();
