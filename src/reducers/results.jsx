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

    return {
      ...state,
      items: items,
      total: action.data.hits.total,
      doc_count: 162576  // TODO: Update API results to always provide total count
    }

  default:
    return state
  }
}
