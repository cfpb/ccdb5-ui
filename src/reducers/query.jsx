import { SEARCH_TEXT, CHANGE_PAGE } from '../constants'
export const defaultQuery = {
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
      from: 0
    }

  case CHANGE_PAGE:
    return {
      ...state,
      from: (action.page - 1) * state.size
    }

  default:
    return state
  }
}
