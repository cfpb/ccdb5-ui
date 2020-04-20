import * as constants from '../constants'
import { sendHitsQuery, sendQuery } from '../actions/complaints'
import { coalesce } from '../utils'

export const queryManager = store => next => action => {
  // call the next function
  // eslint-disable-next-line callback-return
  const result = next( action )

  const requery = coalesce( action, 'requery', constants.REQUERY_NEVER )

  if ( requery === constants.REQUERY_ALWAYS ) {
    store.dispatch( sendQuery() )
  } else if ( requery === constants.REQUERY_HITS_ONLY ) {
    store.dispatch( sendHitsQuery() )
  }

  return result
}

export default queryManager
