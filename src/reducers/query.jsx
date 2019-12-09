import * as types from '../constants'
import moment from 'moment';
import { shortIsoFormat } from '../utils'
const queryString = require( 'query-string' );

export const defaultQuery = {
  date_received_max: new Date(),
  date_received_min: new Date( moment().subtract(3, 'months').calendar() ),
  searchText: '',
  searchField: 'all',
  from: 0,
  size: 25,
  sort: 'created_date_desc'
}

const fieldMap = {
  searchText: 'search_term',
  searchField: 'field',
  from: 'frm'
}

const urlParams = [ 'searchText', 'searchField' ]
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
* @param {object} action the payload containing the key/value pairs
* @returns {object} a filtered set of key/value pairs with the values set to
* the correct type
*/
function processParams( state, action ) {
  const params = action.params
  const processed = Object.assign( {}, defaultQuery )

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

  // Handle numeric params
  urlParamsInt.forEach( field => {
    if ( typeof params[field] !== 'undefined' ) {
      const n = parseInt( params[field], 10 )
      if ( isNaN( n ) === false ) {
        processed[field] = n
      }
    }
  } )

  return processed
}


/**
 * Change a date range filter according to selected interval
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the payload containing the date interval to change
 * @returns {object} the new state for the Redux store
 */
export function changeDateInterval( state, action ) {

  const dateInterval = action.dateInterval;
  const newState = {
    ...state
  };

  switch ( dateInterval ) {
    case '3m':
      newState.date_received_min = new Date(
        moment().subtract( 3, 'months' ).calendar()
      );
      break;
    case '6m':
      newState.date_received_min = new Date(
        moment().subtract( 6, 'months' ).calendar()
      );
      break;
    case '1y':
      newState.date_received_min = new Date(
        moment().subtract( 1, 'year' ).calendar()
      );
      break;
    case '3y':
      newState.date_received_min = new Date(
        moment().subtract( 3, 'years' ).calendar()
      );
      break;
    case 'All':
      newState.date_received_min = new Date( types.DATE_RANGE_MIN );
      newState.date_received_max = new Date();
      break;
    default:
      break;
  }

  return newState;
}


/**
* Change a date range filter
*
* @param {object} state the current state in the Redux store
* @param {object} action the payload containing the date range to change
* @returns {object} the new state for the Redux store
*/
export function changeDateRange( state, action ) {

  const fields = [
    action.filterName + '_min',
    action.filterName + '_max'
  ]

  const newState = {
    ...state,
    [fields[0]]: action.minDate,
    [fields[1]]: action.maxDate
  }

  // Remove nulls
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
    [action.filterName]: action.filterValue
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
* Removes all filters from the current set
*
* @param {object} state the current state in the Redux store
* @returns {object} the new state for the Redux store
*/
export function removeAllFilters( state ) {
  const newState = { ...state }

  const allFilters = types.knownFilters.concat(
    types.dateFilters, types.flagFilters
  )

  if ( state.searchField === types.NARRATIVE_SEARCH_FIELD ) {
    const idx = allFilters.indexOf( 'has_narrative' )
    allFilters.splice( idx, 1 )
  }

  allFilters.forEach( kf => {
    if ( kf in newState ) {
      delete newState[kf]
    }
  } )
  return newState
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
// Query String Builder

/**
* Converts a set of key/value pairs into a query string for API calls
*
* @param {string} state a set of key/value pairs
* @returns {string} a formatted query string
*/
export function stateToQS( state ) {
  const params = {}
  const fields = Object.keys( state )

  // Copy over the fields
  fields.forEach( field => {
    // Do not include empty fields
    if ( !state[field] ) {
      return;
    }

    var value = state[field]

    // Process dates
    if ( types.dateFilters.indexOf( field ) !== -1 ) {
      value = shortIsoFormat( value )
    }

    // Process boolean flags
    const positives = [ 'yes', 'true' ]
    if ( types.flagFilters.indexOf( field ) !== -1 ) {
      value = positives.includes( String( value ).toLowerCase() )
    }

    // Map the internal field names to the API field names
    if ( fieldMap[field] ) {
      params[fieldMap[field]] = value
    } else {
      params[field] = value
    }
  } )

  return '?' + queryString.stringify( params )
}

// ----------------------------------------------------------------------------
// Action Handlers

/**
* Creates a hash table of action types to handlers
*
* @returns {object} a map of types to functions
*/
export function _buildHandlerMap() {
  const handlers = {}
  handlers[types.DATE_INTERVAL_CHANGED] = changeDateInterval
  handlers[types.DATE_RANGE_CHANGED] = changeDateRange
  handlers[types.FILTER_ALL_REMOVED] = removeAllFilters
  handlers[types.FILTER_CHANGED] = toggleFilter
  handlers[types.FILTER_FLAG_CHANGED] = changeFlagFilter
  handlers[types.FILTER_MULTIPLE_ADDED] = addMultipleFilters
  handlers[types.FILTER_MULTIPLE_REMOVED] = removeMultipleFilters
  handlers[types.FILTER_REMOVED] = removeFilter
  handlers[types.URL_CHANGED] = processParams

  return handlers
}

const _handlers = _buildHandlerMap()

/* eslint complexity: ["error", 6] */

/**
* Routes an action to an appropriate handler
*
* @param {object} state the current state in the Redux store
* @param {object} action the command being executed
* @returns {object} the new state for the Redux store
*/
function handleSpecificAction( state, action ) {
  if ( action.type in _handlers ) {
    return _handlers[action.type]( state, action )
  }

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

    default:
      return state
  }
}

export default ( state = defaultQuery, action ) => {
  const newState = handleSpecificAction( state, action )
  delete newState.queryString

  const qs = stateToQS( newState )
  newState.queryString = qs === '?' ? '' : qs

  return newState
}
