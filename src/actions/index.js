import * as analytics from './analytics';
import * as complaints from './complaints';
import * as url from './url';

/**
 * Aggregates all the known actions into one importable object
 *
 * @returns {object} a merged object of all available actions
 */
function combineActions() {
  return {
    ...analytics,
    ...complaints,
    ...url,
  };
}

export default combineActions();
