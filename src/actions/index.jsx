import * as analytics from './analytics'
import * as complaints from './complaints'
import * as filter from './filter'
import * as paging from './paging'
import * as search from './search'
import * as url from './url'

/**
 * Aggregates all the known actions into one importable object
 *
 * @returns {Object} a merged object of all available actions
 */
function combineActions() {
  return {
    ...analytics,
    ...complaints,
    ...filter,
    ...paging,
    ...search,
    ...url
  }
}

export default combineActions()
