/* eslint-disable camelcase */
import { COMPLAINTS_FAILED, COMPLAINTS_RECEIVED } from '../actions/complaints'
import { API_CALLED } from '../constants'

const defaultResults = {
  activeCall: '',
  doc_count: 0,
  error: '',
  lastUpdated: null,
  lastIndexed: null,
  hasDataIssue: false,
  isDataStale: false,
  isNarrativeStale: false,
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
        activeCall: action.url,
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
        activeCall: '',
        doc_count,
        error: '',
        lastUpdated: action.data._meta.last_updated,
        lastIndexed: action.data._meta.last_indexed,
        hasDataIssue: action.data._meta.has_data_issue,
        isDataStale: action.data._meta.is_data_stale,
        isNarrativeStale: action.data._meta.is_narrative_stale,
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
