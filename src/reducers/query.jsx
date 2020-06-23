/* eslint complexity: ["error", 7] */

import * as types from '../constants'
import {
  calculateDateRange, clamp, hasFiltersEnabled, shortIsoFormat, startOfToday
} from '../utils'
import { getSubLens, isGreaterThanYear } from '../utils/trends'
import actions from '../actions'
import moment from 'moment';

const queryString = require( 'query-string' );

/* eslint-disable camelcase */
export const defaultQuery = {
  chartType: 'line',
  dateInterval: 'Month',
  dateRange: '3y',
  date_received_max: startOfToday(),
  date_received_min: new Date(
    moment( startOfToday() ).subtract( 3, 'years' )
  ),
  enablePer1000: true,
  focus: '',
  from: 0,
  mapWarningEnabled: true,
  lens: 'Overview',
  page: 1,
  searchField: 'all',
  searchText: '',
  size: 25,
  sort: 'created_date_desc',
  subLens: '',
  tab: types.MODE_MAP,
  totalPages: 0,
  trendDepth: '5',
  trendsDateWarningEnabled: false
}

const fieldMap = {
  searchText: 'search_term',
  searchField: 'field',
  from: 'frm'
}

const trendFieldMap = {
  dateInterval: 'trend_interval',
  lens: 'lens',
  subLens: 'sub_lens',
  trendDepth: 'trend_depth'
}

const urlParams = [
  'dateRange', 'searchText', 'searchField', 'tab',
  'lens', 'dateInterval', 'subLens', 'focus', 'chartType', 'trendDepth'
]
const urlParamsInt = [ 'from', 'page', 'size' ]

// ----------------------------------------------------------------------------
// Helper functions

/**
* Makes sure the date range reflects the actual dates selected
*
* @param {object} state the raw, unvalidated state
* @returns {object} the validated state
*/
export function alignDateRange( state ) {
  // Shorten the input field names
  const dateMax = state.date_received_max
  const dateMin = state.date_received_min

  // All
  if ( moment( dateMax ).isSame( defaultQuery.date_received_max ) &&
    moment( dateMin ).isSame( types.DATE_RANGE_MIN )
  ) {
    state.dateRange = 'All'
    return state
  }

  const rangeMap = {
    '3y': new Date( moment( dateMax ).subtract( 3, 'years' ) ),
    '3m': new Date( moment( dateMax ).subtract( 3, 'months' ) ),
    '6m': new Date( moment( dateMax ).subtract( 6, 'months' ) ),
    '1y': new Date( moment( dateMax ).subtract( 1, 'year' ) )
  }
  const ranges = Object.keys( rangeMap )
  let matched = false

  for ( let i = 0; i < ranges.length && !matched; i++ ) {
    const range = ranges[i]

    if ( moment( dateMin ).isSame( rangeMap[range], 'day' ) ) {
      state.dateRange = range
      matched = true
    }
  }

  // No matches, clear
  if ( !matched ) {
    state.dateRange = ''
  }

  return state
}

/**
* Check for a common case where there is a date range but no dates
*
* @param {Object} params a set of URL parameters
* @returns {Boolean} true if the params meet this condition
*/
export function dateRangeNoDates( params ) {
  const keys = Object.keys( params )

  return (
    keys.includes( 'dateRange' ) &&
    !keys.includes( 'date_received_min' ) &&
    !keys.includes( 'date_received_max' )
  )
}

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
  let processed = Object.assign( {}, defaultQuery )

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

  // Apply the date range
  if ( dateRangeNoDates( params ) || params.dateRange === 'All' ) {
    const innerAction = { dateRange: params.dateRange }
    processed = changeDateRange( processed, innerAction )
  }

  return alignDateRange( processed )
}

/**
 * update state based on changeDateInterval action
 * @param {object} state current redux state
 * @param {object} action command executed
 * @returns {object} new state in redux
 */
function changeDateInterval( state, action ) {
  return {
    ...state,
    dateInterval: action.dateInterval
  }
}

/**
 * Change a date range filter according to selected range
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the payload containing the date range
 * @returns {object} the new state for the Redux store
 */
export function changeDateRange( state, action ) {

  const dateRange = action.dateRange;
  const newState = {
    ...state,
    dateRange
  }

  const maxDate = startOfToday()

  const res = {
    '3m': new Date( moment( maxDate ).subtract( 3, 'months' ) ),
    '6m': new Date( moment( maxDate ).subtract( 6, 'months' ) ),
    '1y': new Date( moment( maxDate ).subtract( 1, 'year' ) ),
    '3y': new Date( moment( maxDate ).subtract( 3, 'years' ) )
  }

  if ( res[dateRange] ) {
    newState.date_received_min = res[dateRange]
  } else if ( dateRange === 'All' ) {
    newState.date_received_min = new Date( types.DATE_RANGE_MIN )
  }

  newState.date_received_max = maxDate

  return newState
}

/**
* Change a date range filter
*
* @param {object} state the current state in the Redux store
* @param {object} action the payload containing the date range to change
* @returns {object} the new state for the Redux store
*/
export function changeDates( state, action ) {
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

  const dateRange = calculateDateRange( minDate, maxDate )
  if ( dateRange ) {
    newState.dateRange = dateRange
  } else {
    delete newState.dateRange
  }

  return newState
}

/**
 * Makes sure that we have a valid dateInterval is selected, or moves to week
 * when the date range > 1yr
 *
 * @param {object} queryState the current state of query reducer
 */
export function validateDateInterval( queryState ) {
  const { date_received_min, date_received_max, dateInterval } = queryState
  // determine if we need to update date Interval if range > 1 yr
  if ( isGreaterThanYear( date_received_min, date_received_max ) &&
    dateInterval === 'Day' ) {
    queryState.dateInterval = 'Week'
    queryState.trendsDateWarningEnabled = true
  }

  // > 1yr, so we can go ahead and disable the warning
  if ( !isGreaterThanYear( date_received_min, date_received_max ) ) {
    queryState.trendsDateWarningEnabled = false
  }
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
  const newState = {
    ...state,
    [action.filterName]: filterArrayAction(
      state[action.filterName], action.filterValue.key
    )
  }

  return newState
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

  const newState = {
    ...state,
    state: stateFilters
  }

  return newState
}

/**
 * removes all state filters in the current set
 *
 * @param {object} state the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function clearStateFilter( state ) {
  const newState = {
    ...state,
    state: []
  }

  return newState
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
 * removes one state filters in the current set
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the payload containing the filters to change
 * @returns {object} the new state for the Redux store
 */
export function removeStateFilter( state, action ) {
  let stateFilters = state.state || []
  const { abbr } = action.selectedState
  stateFilters = stateFilters.filter( o => o !== abbr )

  const newState = {
    ...state,
    state: stateFilters
  }

  return newState
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

  // set date range to All
  // adjust date filter for max and min ranges
  newState.dateRange = 'All'
  /* eslint-disable camelcase */
  newState.date_received_min = new Date( types.DATE_RANGE_MIN )
  newState.date_received_max = startOfToday()

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
  if ( action.filterName === 'has_narrative' ) {
    delete newState.has_narrative
  } else if ( action.filterName in newState ) {
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
 * Handler for the dismiss map warning action
 *
 * @param {object} state the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function dismissMapWarning( state ) {
  return {
    ...state,
    mapWarningEnabled: false
  }
}

/**
 * Handler for the dismiss trends warning action
 *
 * @param {object} state the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function dismissTrendsDateWarning( state ) {
  return {
    ...state,
    trendsDateWarningEnabled: false
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

/** Handler for the depth changed action
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the command being executed
 * @returns {object} the new state for the Redux store
 */
function changeDepth( state, action ) {
  return {
    ...state,
    trendDepth: action.depth
  }
}

/** Handler for the depth reset action
 *
 * @param {object} state the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
function resetDepth( state ) {
  return {
    ...state,
    trendDepth: '5'
  }
}

/** Handler for the focus selected action
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the command being executed
 * @returns {object} the new state for the Redux store
 */
function changeFocus( state, action ) {
  return {
    ...state,
    focus: action.focus
  }
}


/**
 * update state based on changeDataLens action
 * @param {object} state current redux state
 * @param {object} action command executed
 * @returns {object} new state in redux
 */
function changeDataLens( state, action ) {
  return {
    ...state,
    focus: '',
    lens: action.lens,
    subLens: getSubLens( action.lens )
  }
}

/**
 * update state based on changeDataSubLens action
 * @param {object} state current redux state
 * @param {object} action command executed
 * @returns {object} new state in redux
 */
function changeDataSubLens( state, action ) {
  return {
    ...state,
    subLens: action.subLens.toLowerCase()
  }
}

/**
 * Handler for the update chart type action
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the command being executed
 * @returns {object} the new state for the Redux store
 */
export function updateChartType( state, action ) {
  return {
    ...state,
    chartType: action.chartType
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
    } else if ( trendFieldMap[field] ) {
      params[trendFieldMap[field]] = value.toString().toLowerCase()
    } else {
      params[field] = value
    }
  } )

  types.excludeFields.forEach( f => {
    delete params[f]
  } )

  return '?' + queryString.stringify( params )
}

/**
 * helper function to check if per1000 & map warnings should be enabled
 * @param {object} queryState state we need to validate
 */
export function validatePer1000( queryState ) {
  queryState.enablePer1000 = !hasFiltersEnabled( queryState )
  if ( queryState.enablePer1000 ) {
    queryState.mapWarningEnabled = true
  }
}

// ----------------------------------------------------------------------------
// Action Handlers

/**
* Creates a hash table of action types to handlers
*
* @returns {object} a map of types to functions
*/
// eslint-disable-next-line max-statements, require-jsdoc
export function _buildHandlerMap() {
  const handlers = {}
  handlers[actions.CHART_TYPE_CHANGED] = updateChartType
  handlers[actions.COMPLAINTS_RECEIVED] = updateTotalPages
  handlers[actions.DATA_LENS_CHANGED] = changeDataLens
  handlers[actions.DATA_SUBLENS_CHANGED] = changeDataSubLens
  handlers[actions.DATE_INTERVAL_CHANGED] = changeDateInterval
  handlers[actions.DATE_RANGE_CHANGED] = changeDateRange
  handlers[actions.DATES_CHANGED] = changeDates
  handlers[actions.DEPTH_CHANGED] = changeDepth
  handlers[actions.DEPTH_RESET] = resetDepth
  handlers[actions.FILTER_ALL_REMOVED] = removeAllFilters
  handlers[actions.FILTER_CHANGED] = toggleFilter
  handlers[actions.FILTER_FLAG_CHANGED] = toggleFlagFilter
  handlers[actions.FILTER_MULTIPLE_ADDED] = addMultipleFilters
  handlers[actions.FILTER_MULTIPLE_REMOVED] = removeMultipleFilters
  handlers[actions.FILTER_REMOVED] = removeFilter
  handlers[actions.FOCUS_CHANGED] = changeFocus
  handlers[actions.PAGE_CHANGED] = changePage
  handlers[actions.MAP_WARNING_DISMISSED] = dismissMapWarning
  handlers[actions.NEXT_PAGE_SHOWN] = nextPage
  handlers[actions.PREV_PAGE_SHOWN] = prevPage
  handlers[actions.SIZE_CHANGED] = changeSize
  handlers[actions.SORT_CHANGED] = changeSort
  handlers[actions.STATE_COMPLAINTS_SHOWN] = showStateComplaints
  handlers[actions.STATE_FILTER_ADDED] = addStateFilter
  handlers[actions.STATE_FILTER_CLEARED] = clearStateFilter
  handlers[actions.STATE_FILTER_REMOVED] = removeStateFilter
  handlers[actions.TAB_CHANGED] = changeTab
  handlers[actions.TRENDS_DATE_WARNING_DISMISSED] = dismissTrendsDateWarning
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

  if ( newState.tab === types.MODE_MAP ) {
    // only update the map warning items when we're on the map tab
    validatePer1000( newState )
  }

  if ( newState.tab === types.MODE_TRENDS ) {
    // swap date interval in cases where the date range is > 1yr
    validateDateInterval( newState )
  }


  const qs = stateToQS( newState )
  newState.queryString = qs === '?' ? '' : qs

  return newState
}
