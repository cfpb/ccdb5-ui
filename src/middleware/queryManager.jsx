import * as constants from '../constants'
import { coalesce } from '../utils'
import { getComplaints } from '../actions/complaints'

export const queryManager = store => next => action => {
  // call the next function
  // eslint-disable-next-line callback-return
  const result = next( action )

  const requery = coalesce(
    action, 'requery', constants.REQUERY_NEVER
  );

  // are we going to have a separate get hits?
  if ( requery === constants.REQUERY_ALWAYS ) {
    store.dispatch( getComplaints() )
  } else if ( requery === constants.REQUERY_HITS_ONLY ) {
    store.dispatch( getComplaints() )
  }

  return result
}

export default queryManager
