import * as types from '../constants'

export const defaultQuery = {
  searchText: '',
  searchField: 'all',
  from: 0,
  size: 10,
  sort: 'relevance_desc'
}

const urlParams = [ 'searchText', 'searchField', 'from', 'size' ];
const urlParamsInt = [ 'from', 'size' ];

// ----------------------------------------------------------------------------
// Complex reduction logic

function processParams( state, params ) {
  const processed = Object.assign( {}, state )

  // Filter for known
  urlParams.forEach( field => {
    if ( typeof params[field] !== 'undefined' ) {
      processed[field] = params[field]
    }
  } )

  // Handle the aggregation filters
  types.knownFilters.forEach( field => {
    if ( typeof params[field] !== 'undefined' ) {
      if ( typeof params[field] === 'string' ) {
        processed[field] = [ params[field] ];
      } else {
        processed[field] = params[field];
      }
    }
  } )

  // Convert from strings
  urlParamsInt.forEach( field => {
    if ( typeof processed[field] !== 'undefined' ) {
      processed[field] = parseInt( processed[field], 10 )
    }
  } )

  return processed
}

export function addMultipleFilters( state, action ) {
  const newState = { ...state }
  const name = action.filterName
  const a = newState[name] || []

  // Add the filters
  action.values.forEach( x => {
    if ( a.indexOf( x ) === -1 ) {
      a.push( x )
    }
  } )

  newState[name] = a
  return newState
}

export function filterArrayAction( target = [], val ) {
  // defaults create new array if param doesn't exist yet
  // if the value doesn't exist in the array, pushes
  // if value exists in the array, filters.
  // returns a cast copy to avoid any state mutation

  if ( target.indexOf( val ) === -1 ) {
    target.push( val );
  } else {
    target = target.filter( function( value ) {
      return value !== val;
    } );
  }
  return [ ...target ];
}

export function toggleFilter( state, action ) {
  return {
    ...state,
    // { timely: [ 'Yes' ] } - returns an updated state for combined query reducer
    [action.filterName]: filterArrayAction( state[action.filterName], action.filterValue.key )
  }
}

function removeFilter( state, action ) {
  const newState = { ...state }
  if ( action.filterName in newState ) {
    const idx = newState[action.filterName].indexOf( action.filterValue )
    if ( idx !== -1 ) {
      newState[action.filterName].splice( idx, 1 )
    }
  }
  return newState
}

function removeMultipleFilters( state, action ) {
  const newState = { ...state }
  const a = newState[action.filterName]
  if ( a ) {
    action.values.forEach( x => {
      const idx = a.indexOf( x )
      if ( idx !== -1 ) {
        a.splice( idx, 1 )
      }
    } )
  }

  return newState
}

// ----------------------------------------------------------------------------
// Action Handler

export default ( state = defaultQuery, action ) => {
  switch ( action.type ) {
    case types.SEARCH_CHANGED:
      return {
        ...state,
        searchText: action.searchText,
        searchField: action.searchField,
        from: 0
      }

    case types.PAGE_CHANGED:
      return {
        ...state,
        from: ( action.page - 1 ) * state.size
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
      return processParams( state, action.params )

    case types.FILTER_CHANGED:
      return toggleFilter( state, action )

    case types.FILTER_REMOVED:
      return removeFilter( state, action )

    case types.FILTER_ALL_REMOVED: {
      const newState = { ...state }
      types.knownFilters.forEach( kf => {
        if ( kf in newState ) {
          delete newState[kf]
        }
      } )
      return newState
    }

    case types.FILTER_MULTIPLE_ADDED:
      return addMultipleFilters( state, action )

    case types.FILTER_MULTIPLE_REMOVED:
      return removeMultipleFilters( state, action )

    default:
      return state
  }
}
