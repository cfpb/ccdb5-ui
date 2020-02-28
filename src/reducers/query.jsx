import * as types from '../constants'
import { calculateDateInterval, clamp, shortIsoFormat } from '../utils'
import actions from '../actions'
import moment from 'moment';

const queryString = require( 'query-string' );

/* eslint-disable camelcase */
export const defaultQuery = {
  dateInterval: '3y',
  date_received_max: new Date(),
  date_received_min: new Date( moment().subtract( 3, 'years' ).calendar() ),
  from: 0,
  searchText: '',
  searchField: 'all',
  size: 25,
  sort: 'created_date_desc',
  page: 1,
  tab: types.MODE_MAP,
  totalPages: 0
}

const fieldMap = {
  searchText: 'search_term',
  searchField: 'field',
  from: 'frm'
}

// exclude from the url
const excludeParams = [ 'totalPages' ]


const urlParams = [ 'dateInterval', 'searchText', 'searchField', 'tab' ]
const urlParamsInt = [ 'from', 'page', 'size' ]

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
    ...state,
    dateInterval
  }

  const res = {
    '3m': new Date( moment().subtract( 3, 'months' ).calendar() ),
    '6m': new Date( moment().subtract( 6, 'months' ).calendar() ),
    '1y': new Date( moment().subtract( 1, 'year' ).calendar() ),
    '3y': new Date( moment().subtract( 3, 'years' ).calendar() )
  }

  if ( res[dateInterval] ) {
    newState.date_received_min = res[dateInterval]
  } else if ( dateInterval === 'All' ) {
    newState.date_received_min = new Date( types.DATE_RANGE_MIN )
  }

  newState.date_received_max = new Date( moment().startOf( 'day' ).toString() )

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

  let { maxDate, minDate } = action

  minDate = moment( minDate ).isValid() ?
    new Date( moment( minDate ).startOf( 'day' ) ) : null
  maxDate = moment( maxDate ).isValid() ?
    new Date( moment( maxDate ).startOf( 'day' ) ) : null


  const newState = {
    ...state,
    [fields[0]]: minDate,
    [fields[1]]: maxDate
  }

  // Remove nulls
  fields.forEach( field => {
    if ( newState[field] === null ) {
      delete newState[field]
    }
  } )

  const dateInterval = calculateDateInterval( minDate, maxDate )
  if ( dateInterval ) {
    newState.dateInterval = dateInterval
  } else {
    delete newState.dateInterval
  }

  return newState
}

/**
* Change a boolean flag filter
*
* @param {object} state the current state in the Redux store
* @param {object} action the payload containing the value to change
* @returns {object} the new state for the Redux store
*/
export function toggleFlagFilter( state, action ) {

  /* eslint-disable camelcase */
  const newState = {
    ...state,
    [action.filterName]: Boolean( !state[action.filterName] )
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
 * updates when search text params are changed
 * @param {object} state current state in redux
 * @param {object} action payload with search text and field
 * @returns {object} updated state for redux
 */
export function changeSearch( state, action ) {
  return {
    ...state,
    from: 0,
    page: 1,
    searchText: action.searchText,
    searchField: action.searchField
  }
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
 * adds a state filter in the current set
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the payload containing the filters to change
 * @returns {object} the new state for the Redux store
 */
export function addStateFilter( state, action ) {
  const stateFilters = state.state || []
  const { abbr } = action.selectedState
  if ( !stateFilters.includes( abbr ) ) {
    stateFilters.push( abbr )
  }

  return {
    ...state,
    state: stateFilters
  }
}

/**
 * removes a state filter in the current set
 *
 * @param {object} state the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function clearStateFilter( state ) {
  return {
    ...state,
    state: []
  }
}

/**
 * only applies the single state filter and switches view mode to complaints
 *
 * @param {object} state the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function showStateComplaints( state ) {
  return {
    ...state,
    tab: types.MODE_LIST
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

/**
 * update state based on pageChanged action
 * @param {object} state current redux state
 * @param {object} action command executed
 * @returns {object} new state in redux
 */
function changePage( state, action ) {
  const page = parseInt( action.page, 10 )
  return {
    ...state,
    from: ( page - 1 ) * state.size,
    page: page
  }
}

/**
 * Update state based on the sort order changed action
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the command being executed
 * @returns {object} the new state for the Redux store
 */
function prevPage( state ) {
  // don't let them go lower than 1
  const page = clamp( state.page - 1, 1, state.page );
  return {
    ...state,
    from: ( page - 1 ) * state.size,
    page: page
  };
}

/**
 * Update state based on the sort order changed action
 *
 * @param {object} state the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
function nextPage( state ) {
  // don't let them go past the total num of pages
  const page = clamp( state.page + 1, 1, state.totalPages );
  return {
    ...state,
    from: ( page - 1 ) * state.size,
    page: page
  };
}


/**
 * update state based on changeSize action
 * @param {object} state current redux state
 * @param {object} action command executed
 * @returns {object} new state in redux
 */
function changeSize( state, action ) {
  return {
    ...state,
    from: 0,
    page: 1,
    size: action.size
  }
}

/**
 * update state based on changeSort action
 * @param {object} state current redux state
 * @param {object} action command executed
 * @returns {object} new state in redux
 */
function changeSort( state, action ) {
  return {
    ...state,
    sort: action.sort
  }
}

/**
 * update state based on tabChanged action
 * @param {object} state current redux state
 * @param {object} action command executed
 * @returns {object} new state in redux
 */
function changeTab( state, action ) {
  return {
    ...state,
    tab: action.tab
  }
}

/**
 * Upon complaint received, we need to make sure to reset the page
 *
 * @param  {object} state the current state in the Redux store
 * @param {object} action the command being executed
 * @returns {{page: number, totalPages: number}} the new state
 */
function updateTotalPages( state, action ) {
  const totalPages = Math.ceil( action.data.hits.total / state.size );
  // reset pager to 1 if the number of total pages is less than current page
  const page = state.page > totalPages ? totalPages : state.page;
  return {
    ...state,
    page,
    totalPages
  }
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
  /* eslint complexity: ["error", 6] */
  fields.forEach( field => {
    // Do not include empty fields
    if ( !state[field] ) {
      return;
    }

    // Avoid recursion
    if ( field === 'queryString' ) {
      return;
    }

    let value = state[field]

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

  // exclude certain params from the URL since it's a calculated value
  // coming from db and cant be restored
  excludeParams.forEach( o => {
    delete state[o]
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
  handlers[actions.COMPLAINTS_RECEIVED] = updateTotalPages;
  handlers[actions.DATE_INTERVAL_CHANGED] = changeDateInterval
  handlers[actions.DATE_RANGE_CHANGED] = changeDateRange
  handlers[actions.FILTER_ALL_REMOVED] = removeAllFilters
  handlers[actions.FILTER_CHANGED] = toggleFilter
  handlers[actions.FILTER_FLAG_CHANGED] = toggleFlagFilter
  handlers[actions.FILTER_MULTIPLE_ADDED] = addMultipleFilters
  handlers[actions.FILTER_MULTIPLE_REMOVED] = removeMultipleFilters
  handlers[actions.FILTER_REMOVED] = removeFilter
  handlers[actions.PAGE_CHANGED] = changePage
  handlers[actions.NEXT_PAGE_SHOWN] = nextPage
  handlers[actions.PREV_PAGE_SHOWN] = prevPage
  handlers[actions.SIZE_CHANGED] = changeSize
  handlers[actions.SORT_CHANGED] = changeSort
  handlers[actions.STATE_COMPLAINTS_SHOWN] = showStateComplaints
  handlers[actions.STATE_FILTER_ADDED] = addStateFilter
  handlers[actions.STATE_FILTER_CLEARED] = clearStateFilter
  handlers[actions.TAB_CHANGED] = changeTab
  handlers[actions.URL_CHANGED] = processParams
  handlers[actions.SEARCH_CHANGED] = changeSearch

  return handlers
}

const _handlers = _buildHandlerMap()

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

  return state
}

export default ( state = defaultQuery, action ) => {
  const newState = handleSpecificAction( state, action )

  const qs = stateToQS( newState )
  newState.queryString = qs === '?' ? '' : qs

  return newState
}
