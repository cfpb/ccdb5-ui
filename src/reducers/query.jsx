import * as types from '../constants'

export const defaultQuery = {
  searchText: '',
  from: 0,
  size: 10,
  sort: 'relevance_desc'
}

const urlParams = ['searchText', 'from', 'size'];
const urlParamsInt = ['from', 'size'];

export function processParams(state, params) {
  const processed = Object.assign({}, state)

  // Filter for known
  urlParams.forEach(field => {
    if( typeof params[field] !== 'undefined' ) {
      processed[field] = params[field]
    }
  })

  // Convert from strings
  urlParamsInt.forEach(field => {
    if( typeof processed[field] !== 'undefined' ) {
      processed[field] = parseInt(processed[field], 10)
    }
  })

  return processed
}

export default (state = defaultQuery, action) => {
  switch(action.type) {
  case types.SEARCH_CHANGED:
    return {
      ...state,
      searchText: action.searchText,
      from: 0
    }

  case types.PAGE_CHANGED:
    return {
      ...state,
      from: (action.page - 1) * state.size
    }

  case types.SIZE_CHANGED:
    return {
      ...state,
      from: 0,
      size: action.size
    }

  case types.SORT_CHANGED:
    return {
      ...state,
      sort: action.sort
    }

  case types.URL_CHANGED:
    return processParams(state, action.params)

  default:
    return state
  }
}
