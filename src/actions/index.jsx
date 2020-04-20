import * as analytics from './analytics'
import * as complaints from './complaints'
import * as filter from './filter'
import * as map from './map'
import * as paging from './paging'
import * as search from './search'
import * as url from './url'
import * as view from './view'

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
    ...map,
    ...paging,
    ...search,
    ...url,
    ...view
  }
}

export default combineActions()
