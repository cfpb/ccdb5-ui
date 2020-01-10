/* eslint-disable camelcase */
import {
  AGGREGATIONS_API_CALLED, AGGREGATIONS_FAILED, AGGREGATIONS_RECEIVED,
  COMPLAINTS_API_CALLED, COMPLAINTS_FAILED, COMPLAINTS_RECEIVED
} from '../actions/complaints'

const defaultResults = {
  activeCall: '',
  aggregationResults: {},
  doc_count: 0,
  error: '',
  lastUpdated: null,
  lastIndexed: null,
  loadingAggregations: false,
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
    case AGGREGATIONS_API_CALLED:
      return {
        ...state,
        activeCall: action.url,
        loadingAggregations: true
      }

    case AGGREGATIONS_RECEIVED:
      return {
        ...state,
        aggregationResults: action.data,
        loadingAggregations: false
      }

    case AGGREGATIONS_FAILED:
      return {
        ...state,
        aggregationResults: {},
        loadingAggregations: false,
        error: action.error
      }

    case COMPLAINTS_API_CALLED:
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
