import { COMPLAINTS_RECEIVED } from '../constants'
const defaultResults = {
  items: [],
  total: 0,
  doc_count: 0
}

export default (state = defaultResults, action) => {
  switch(action.type) {
  case COMPLAINTS_RECEIVED:
    const items = action.data.hits.hits.map(x => {
      return x._source
    })

    const doc_count = Math.max(
      state.doc_count,
      action.data.hits.total,
      action.data['_meta'].total_record_count
    )

    return {
      ...state,
      items: items,
      total: action.data.hits.total,
      doc_count
    }

  default:
    return state
  }
}
