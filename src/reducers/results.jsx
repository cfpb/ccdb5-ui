import { COMPLAINTS_FAILED, COMPLAINTS_RECEIVED } from '../constants'
const defaultResults = {
  doc_count: 0,
  error: '',
  items: [],
  total: 0
}

export default ( state = defaultResults, action ) => {
  switch ( action.type ) {
    case COMPLAINTS_RECEIVED: {
      const items = action.data.hits.hits.map( x => x._source )

      const doc_count = Math.max(
      state.doc_count,
      action.data.hits.total,
      action.data._meta.total_record_count
    )

      return {
        ...state,
        doc_count,
        error: '',
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
