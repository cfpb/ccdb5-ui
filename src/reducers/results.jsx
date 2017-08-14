/* eslint-disable camelcase */

import {
  API_CALLED, COMPLAINTS_FAILED, COMPLAINTS_RECEIVED
} from '../constants'

const defaultResults = {
  doc_count: 0,
  error: '',
  isLoading: false,
  items: [],
  total: 0
}

export const _processHits = data => data.hits.hits.map( x => {
  const item = { ...x._source }

  if ( x.highlight ) {
    Object.keys( x.highlight ).forEach( field => {
      item[field] = x.highlight[field][0]
    } )
  }

  return item
} )

export default ( state = defaultResults, action ) => {
  switch ( action.type ) {
    case API_CALLED:
      return {
        ...state,
        isLoading: true
      }

    case COMPLAINTS_RECEIVED: {
      const items = _processHits( action.data )

      const doc_count = Math.max(
      state.doc_count,
      action.data.hits.total,
      action.data._meta.total_record_count
    )

      return {
        ...state,
        doc_count,
        error: '',
        isLoading: false,
        items: items,
        total: action.data.hits.total
      }
    }

    case COMPLAINTS_FAILED:
      return {
        ...defaultResults,
        error: action.error
      }

    default:
      return state
  }
}
