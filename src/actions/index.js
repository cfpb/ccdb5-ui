import * as analytics from './analytics';
import * as complaints from './complaints';

/**
 * Aggregates all the known actions into one importable object
 *
 * @returns {object} a merged object of all available actions
 */
function combineActions() {
  return {
    ...analytics,
    ...complaints,
  };
}

export default combineActions();
