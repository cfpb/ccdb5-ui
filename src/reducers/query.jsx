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

export function filterArrayAction(target = [], val){
  // defaults create new array if param doesn't exist yet
  // if the value doesn't exist in the array, pushes
  // if value exists in the array, filters.
  // returns a cast copy to avoid any state mutation

  if (target.indexOf(val) === -1) {
    target.push(val);
  } else {
    target = target.filter(function(value){
      return value !== val;
    });
  }
  return [ ...target ];
}
export function toggleFilter(state, action) {
  console.log('TOGGLE RETURN VALUE: ', {
    ...state,
    [action.filterName]: filterArrayAction( state[action.filterName], action.filterValue.key )
  });
  return {
    ...state,
    //{ timely: [ 'Yes' ] } - returns an updated state for combined query reducer
    [action.filterName]: filterArrayAction( state[action.filterName], action.filterValue.key )
  }
}

// TODO: Set defaultQueryState to recognize existing URL params
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
