import { SEARCH_TEXT } from '../constants'
const defaultQuery = {
  searchText: '',
  from: 0,
  size: 10
}

export default (state = defaultQuery, action) => {
  switch(action.type) {
  case SEARCH_TEXT:
    return {
      ...state,
      searchText: action.searchText,
      from: 0,
      total: 0
    }

  default:
    return state
  }
}
