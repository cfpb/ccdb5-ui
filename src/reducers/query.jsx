import { SEARCH_CHANGED, PAGE_CHANGED } from '../constants'
export const defaultQuery = {
  searchText: '',
  from: 0,
  size: 10
}

export default (state = defaultQuery, action) => {
  switch(action.type) {
  case SEARCH_CHANGED:
    return {
      ...state,
      searchText: action.searchText,
      from: 0
    }

  case PAGE_CHANGED:
    return {
      ...state,
      from: (action.page - 1) * state.size
    }

  default:
    return state
  }
}
