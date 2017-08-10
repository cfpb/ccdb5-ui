import * as types from '../constants'

export const defaultQuery = {
  searchText: '',
  searchField: 'all',
  from: 0,
  size: 10,
  sort: 'relevance_desc'
}

const urlParams = [ 'searchText', 'searchField', 'from', 'size' ]
const urlParamsInt = [ 'from', 'size' ]

// ----------------------------------------------------------------------------
// Complex reduction logic

/**
* Safely converts a string to a local date
*
* @param {string} value Hopefully, an ISO-8601 formatted string
* @returns {string} The parsed and validated date, or null
*/
export function toDate( value ) {
  if ( isNaN( Date.parse( value ) ) ) {
    return null
  }

  // Adjust UTC to local timezone
  // This code adjusts for daylight saving time
  // but does not work for locations east of Greenwich
  var utcDate = new Date( value )
  var localTimeThen = new Date(
    utcDate.getFullYear(),
    utcDate.getMonth(),
    utcDate.getDate() + 1
  )

  return localTimeThen
}

/**
* Processes an object of key/value strings into the correct internal format
*
* @param {object} state the current state in the Redux store
* @param {object} params a set of key/value pairs from the URL
* @returns {object} a filtered set of key/value pairs with the values set to
* the correct type
*/
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

  // Handle date filters
  types.dateFilters.forEach( field => {
    if ( typeof params[field] !== 'undefined' ) {
      const d = toDate( params[field] )
      if ( d ) {
        processed[field] = d
      }
    }
  } )

  // Handle flag filters
  types.flagFilters.forEach( field => {
    if ( typeof params[field] !== 'undefined' ) {
      processed[field] = params[field].toString()
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

/**
* Change a date range filter
*
* @param {object} state the current state in the Redux store
* @param {object} action the payload containing the date range to change
* @returns {object} the new state for the Redux store
*/
export function changeDateRange( state, action ) {

  /* eslint-disable camelcase */

  const newState = {
    ...state,
    min_date: action.minDate,
    max_date: action.maxDate
  }

  /* eslint-enable camelcase */

  // Remove nulls
  const fields = [ 'min_date', 'max_date' ]
  fields.forEach( field => {
    if ( newState[field] === null ) {
      delete newState[field]
    }
  } )

  return newState
}

/**
* Change a boolean flag filter
*
* @param {object} state the current state in the Redux store
* @param {object} action the payload containing the value to change
* @returns {object} the new state for the Redux store
*/
export function changeFlagFilter( state, action ) {

  /* eslint-disable camelcase */
  const newState = {
    ...state,
    has_narrative: action.filterValue
  }

  /* eslint-enable camelcase */

  // Remove nulls
  const fields = [ 'has_narrative' ]
  fields.forEach( field => {
    if ( !newState[field] ) {
      delete newState[field]
    }
  } )

  return newState
}

/**
* Adds new filters to the current set
*
* @param {object} state the current state in the Redux store
* @param {object} action the payload containing the filters to add
* @returns {object} the new state for the Redux store
*/
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

/**
* defaults create new array if param doesn't exist yet
* if the value doesn't exist in the array, pushes
* if value exists in the array, filters.
* @param {array} target the current filter
* @param {string} val the filter to toggle
* @returns {array} a cast copy to avoid any state mutation
*/
export function filterArrayAction( target = [], val ) {
  if ( target.indexOf( val ) === -1 ) {
    target.push( val );
  } else {
    target = target.filter( function( value ) {
      return value !== val;
    } );
  }
  return [ ...target ];
}

/**
* Toggles a filter in the current set
*
* @param {object} state the current state in the Redux store
* @param {object} action the payload containing the filters to change
* @returns {object} the new state for the Redux store
*/
export function toggleFilter( state, action ) {
  return {
    ...state,
    [action.filterName]: filterArrayAction(
      state[action.filterName], action.filterValue.key
    )
  }
}

/**
* Removes a filter from the current set
*
* @param {object} state the current state in the Redux store
* @param {object} action the payload containing the filter to remove
* @returns {object} the new state for the Redux store
*/
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

/**
* Removes multiple filters from the current set
*
* @param {object} state the current state in the Redux store
* @param {object} action the payload containing the filters to remove
* @returns {object} the new state for the Redux store
*/
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
    case types.DATE_RANGE_CHANGED:
      return changeDateRange( state, action )

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

    case types.FILTER_FLAG_CHANGED:
      return changeFlagFilter( state, action )

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
