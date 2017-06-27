import * as types from '../constants'

export const defaultQuery = {
  searchText: '',
  from: 0,
  size: 10
}

const urlParams = ['searchText', 'from', 'size', 'timely'];
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

export function toggleFilter(state, params) {
  console.log('REDUCER Params: ', params);
  console.log('REDUCER State: ', state);
  console.log('THING TO PASS TO OBJECT: ', params.filterName,'=',params.filterValue.key);
  return {
    ...state
  }
}

export default (state = defaultQuery, action) => {
  switch(action.type) {
  case types.SEARCH_CHANGED:
  console.log('SEARCH_CHANGED state: ', state);
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

  case types.URL_CHANGED:
    console.log("URL_CHANGED return: ", processParams(state, action.params));
    return processParams(state, action.params)

  case types.FILTER_CHANGED:
    // TODO: Update the search query with the filter change adapted from each AggregationItem
    return toggleFilter(state, action)

  case types.SUBFILTER_CHANGED:
    // TODO: Update the search query with the filter change adapted from each AggregationItem
    return {
      ...state
    }
  default:
    return state
  }
}
