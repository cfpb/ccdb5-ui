/* eslint max-nested-callbacks: ["error", 4] */
/* eslint-disable camelcase */

// reducer for the Map Tab
import * as colors from '../constants/colors'
import {
  clamp, coalesce, getSubKeyName, processErrorMessage
} from '../utils'
import { getSubLens, pruneOther } from '../utils/trends'
import { getTooltipTitle, updateDateBuckets } from '../utils/chart'
import actions from '../actions'
import { isDateEqual } from '../utils/formatDate'

export const defaultState = {
  activeCall: '',
  chartType: 'line',
  colorMap: {},
  error: false,
  expandedTrends: [],
  filterNames: [],
  focus: '',
  isLoading: false,
  lastDate: false,
  lens: 'Overview',
  results: {
    dateRangeArea: [],
    dateRangeBrush: [],
    dateRangeLine: [],
    issue: [],
    product: []
  },
  subLens: '',
  tooltip: false,
  total: 0
}

// ----------------------------------------------------------------------------
// Helpers
/* eslint-disable complexity */
/**
 * helper function to drill down a bucket and generate special names for D3
 * @param {object} state the state in redux
 * @param {array} agg list of aggregations to go through
 * @returns {object} the representative bar in a d3 row chart
 */
function processBucket( state, agg ) {
  const list = []
  const { expandedTrends, filterNames, lens } = state
  for ( let i = 0; i < agg.length; i++ ) {
    const item = agg[i]
    const subKeyName = getSubKeyName( item )

    item.isParent = true
    if ( item[subKeyName] && item[subKeyName].buckets.length ) {
      item.hasChildren = true
      /* istanbul ignore else */
      if ( !filterNames.includes( item.key ) ) {
        filterNames.push( item.key )
      }
    }

    // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_omit
    // Create a parent row.
    // remove the lodash omit since it is deprecated in lodash5
    const tempItem = Object.assign( {}, item )
    delete tempItem[subKeyName]
    list.push( tempItem )

    /* istanbul ignore else */
    if ( item[subKeyName] && item[subKeyName].buckets ) {
      const expandableBuckets = item[subKeyName].buckets

      // only push expand text when a data lens is selected
      if ( lens !== 'Overview' ) {
        // if there's buckets we need to add a separator for rendering
        const labelText = `More Information about ${ item.key }`
        expandableBuckets.push( {
          hasChildren: false,
          isParent: false,
          key: labelText,
          name: labelText,
          splitterText: labelText,
          value: '',
          parent: item.key,
          pctOfSet: '',
          width: 0.3
        } )
      }

      list.push( expandableBuckets )
    }
  }

  const nameMap = []

  // return flattened list
  return []
    .concat( ...list )
    .map( obj => getD3Names( obj, nameMap, expandedTrends ) )
}

/**
 * helper function to get d3 bar chart data
 * @param {object} obj rowdata we are processing
 * @param {array} nameMap list of names we are keeping track of
 * @param {array} expandedTrends list of trends that are open in view
 * @returns {object} the rowdata for row chart
 */
function getD3Names( obj, nameMap, expandedTrends ) {
  let name = obj.key
  // D3 doesnt allow dupe keys, so we have to to append
  // spaces so we have unique keys
  while ( nameMap[name] ) {
    name += ' '
  }

  nameMap[name] = true

  return obj.splitterText ? {
    ...obj,
    visible: expandedTrends.indexOf( obj.parent ) > -1
  } : {
    hasChildren: Boolean( obj.hasChildren ),
    isNotFilter: false,
    isParent: Boolean( obj.isParent ),
    pctOfSet: Number( obj.pctOfSet ),
    name: name,
    value: Number( obj.doc_count ),
    parent: obj.parent || false,
    // visible if no parent, or it is in expanded trends
    visible: !obj.parent || expandedTrends.indexOf( obj.parent ) > -1,
    // this adjusts the thickness of the parent or child bars
    width: obj.parent ? 0.4 : 0.5
  }
}

/**
 * helper function to pluralize field values
 * @param {lens} lens value we are processing
 * @returns {string} for consumption by AreaData function
 */
export function mainNameLens( lens ) {
  if ( lens === 'Product' ) {
    return 'products'
  } else if ( lens === 'Company' ) {
    return 'companies'
  }
  return 'values'
}


/**
 * processes the stuff for the area chart, combining them if necessary
 * @param {object} state redux state
 * @param {object} aggregations coming from the trends api
 * @param {Array} buckets contains trend_period data
 * @returns {object} the data areas for the stacked area chart
 */
function processAreaData( state, aggregations, buckets ) {
  // map subLens / focus values to state
  const { subLens } = state
  const lens = state.focus ? subLens.replace( '_', '-' ) : state.lens

  const mainName = 'Other'
  // overall buckets
  const compBuckets = buckets.map(
    obj => ( {
      name: mainName,
      value: obj.doc_count,
      date: obj.key_as_string
    } )
  )

  // reference buckets to backfill zero values
  const refBuckets = Object.assign( {}, compBuckets )


  const filter = lens.toLowerCase()
  const trendResults = aggregations[filter][filter]
    .buckets.slice( 0, 5 )
  for ( let i = 0; i < trendResults.length; i++ ) {
    const o = trendResults[i]
    // only take first 10 of the buckets for processing
    const reverseBuckets = o.trend_period.buckets.reverse()
    for ( let j = 0; j < reverseBuckets.length; j++ ) {
      const p = reverseBuckets[j]
      compBuckets.push( {
        name: o.key,
        value: p.doc_count,
        date: p.key_as_string
      } )

      // delete total from that date
      const pos = compBuckets
        .findIndex( k => k.name === mainName &&
          isDateEqual( k.date, p.key_as_string ) )

      /* istanbul ignore else */
      if ( pos > -1 ) {
        // subtract the value from total, so we calculate the "Other" bin
        compBuckets[pos].value -= p.doc_count
      }
    }

    // we're missing a bucket, so fill it in.
    const referenceBuckets = Object.values( refBuckets )
    if ( o.trend_period.buckets.length !== referenceBuckets.length ) {
      for ( let k = 0; k < referenceBuckets.length; k++ ) {
        const obj = referenceBuckets[k]
        const datePoint = compBuckets
          .filter( f => f.name === o.key )
          .find( f => isDateEqual( f.date, obj.date ) )
        if ( !datePoint ) {
          compBuckets.push( {
            name: o.key,
            value: 0,
            date: obj.date
          } )
        }
      }
    }
  }

  // compBuckets.sort( function( a, b ) {
  //   return a.date > b.date
  // } )

  // we should prune 'Other' if all of the values are zero
  return pruneOther( compBuckets )
}

/**
 * Process aggs and convert them into a format for Line Charts
 * @param {string} lens Overview, Issue, Product, etc
 * @param {object} aggregations comes from the API
 * @param {string} focus if a focus item was selected
 * @param {string} subLens current subLens
 * @returns {{dataByTopic: ([{dashed: boolean, show: boolean, topic: string,
 * topicName: string, dates: *}]|[])}} theformatted object containing line info
 */
function processLineData( lens, aggregations, focus, subLens ) {
  const areaBuckets = aggregations.dateRangeArea.dateRangeArea.buckets
  const dataByTopic = lens === 'Overview' ? [
    {
      topic: 'Complaints',
      topicName: 'Complaints',
      dashed: false,
      show: true,
      dates: areaBuckets.map( o => ( {
        date: o.key_as_string,
        value: o.doc_count
      } ) )
    }
  ] : []

  if ( lens !== 'Overview' ) {
    // handle Focus Case
    const lensKey = focus ? subLens.replace( '_', '-' ) :
      lens.toLowerCase()
    const aggBuckets = aggregations[lensKey][lensKey].buckets
    for ( let i = 0; i < aggBuckets.length; i++ ) {
      const name = aggBuckets[i].key
      const dateBuckets = updateDateBuckets( name,
        aggBuckets[i].trend_period.buckets, areaBuckets )
      dataByTopic.push( {
        topic: name,
        topicName: name,
        dashed: false,
        show: true,
        dates: dateBuckets
      } )
    }
  }
  return {
    dataByTopic: dataByTopic.slice( 0, 5 )
  }
}

/**
 * processes the aggregation buckets to get the deltas for rows
 * @param {object} bucket subagg bucket with difference intervals
 * @param {string} k key, issue, product etc
 * @param {number} docCount overall agg count of the results being returned
 */
export function processTrendPeriod( bucket, k, docCount ) {
  const trend_period = bucket.trend_period

  /* istanbul ignore else */
  if ( trend_period ) {
    bucket.pctOfSet = ''
    bucket.num_results = docCount
  }

  const subKeyName = getSubKeyName( bucket )
  if ( bucket[subKeyName] ) {
    const subaggBuckets = bucket[subKeyName].buckets
    for ( let j = 0; j < subaggBuckets.length; j++ ) {
      subaggBuckets[j].parent = bucket.key
      processTrendPeriod( subaggBuckets[j], subKeyName, docCount )
    }
  }
}

/**
 * helper function to map color schemes to available data
 * @param {string} lens selected data lens
 * @param {array} rowNames rows that are in the stacked area charts
 * @returns {object} contains Name:Color map
 */
export const getColorScheme = ( lens, rowNames ) => {
  const colScheme = {}
  const colorScheme = colors.DataLens
  const uniqueNames = [ ...new Set( rowNames.map( item => item.name ) ) ]


  for ( let i = 0; i < uniqueNames.length; i++ ) {
    const n = uniqueNames[i]
    const index = clamp( i, 0, 10 )
    colScheme[n] = colorScheme[index]
  }

  colScheme.Complaints = colors.BriteCharts.medium

  // Set constant grey colors for all possible "other" buckets"
  colScheme.Other = colors.DataLens[10]
  colScheme['All other products'] = colors.DataLens[10]
  colScheme['All other companies'] = colors.DataLens[10]
  colScheme['All other values'] = colors.DataLens[10]
  return colScheme
}


/**
 * Copies the results locally
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the command being executed
 * @returns {object} the new state for the Redux store
 */
export function processTrends( state, action ) {
  const aggregations = action.data.aggregations
  const { focus, lens, results, subLens } = state
  let total = 0,
      lastDate

  for ( const k in aggregations ) {
    /* istanbul ignore else */
    if ( aggregations[k] && aggregations[k].doc_count &&
      aggregations[k][k] && aggregations[k][k].buckets ) {
      // set to zero when we are not using focus Lens
      const buckets = aggregations[k][k].buckets
      for ( let i = 0; i < buckets.length; i++ ) {
        const docCount = aggregations[k].doc_count
        processTrendPeriod( buckets[i], k, docCount )
      }
      if ( k === 'dateRangeArea' ) {
        // get the last date now to save time
        lastDate = buckets[buckets.length - 1].key_as_string
        total = aggregations[k].doc_count
        if ( lens !== 'Overview' ) {
          results[k] = processAreaData( state, aggregations, buckets )
        }

        results.dateRangeLine =
          processLineData( lens, aggregations, focus, subLens )
      } else if ( k === 'dateRangeBrush' ) {
        results[k] = buckets.map(
          obj => ( {
            date: obj.key_as_string,
            value: obj.doc_count
          } )
        )
      } else {
        results[k] = processBucket( state, buckets )
      }
    } else if ( defaultState.results.hasOwnProperty( k ) ) {
      // no value, so we clear out the results
      results[k] = []
    }
  }
  const colorMap = getColorScheme( lens, results.dateRangeArea )

  return {
    ...state,
    activeCall: '',
    colorMap,
    error: false,
    isLoading: false,
    lastDate,
    results,
    total
  }
}

/* eslint-enable complexity */
/**
 * Handler for the trend toggle action
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the command being executed
 * @returns {object} the new state for the Redux store
 */
function toggleTrend( state, action ) {
  const { expandedTrends, filterNames, results } = state
  const item = action.value
  const toggled = updateExpandedTrends( item, filterNames, expandedTrends )
  for ( const k in results ) {
    // rip through results and expand the ones, or collapse
    /* istanbul ignore else */
    if ( results.hasOwnProperty( k ) && Array.isArray( results[k] ) ) {
      results[k]
        .filter( o => o.parent === item )
        .forEach( o => {
          o.visible = toggled
        } )
    }
  }

  return {
    ...state,
    expandedTrends
  }
}

/**
 * Helper function to get under eslint complexity limits
 * @param {string} item the trend that was toggled
 * @param {array} filterNames list of available filters we can toggle
 * @param {array} expandedTrends list of the trends that are expanded
 * @returns {boolean} the trend should be visible or not
 */
function updateExpandedTrends( item, filterNames, expandedTrends ) {
  let toggled = false
  const pos = expandedTrends.indexOf( item )

  // if it's an available filter
  if ( filterNames.indexOf( item ) > -1 ) {
    if ( pos === -1 ) {
      toggled = true
      expandedTrends.push( item )
    } else {
      expandedTrends.splice( pos, 1 )
    }
  }

  return toggled
}

// ----------------------------------------------------------------------------
// Action Handlers
/**
 * Updates the state when an tab changed occurs
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the payload containing the key/value pairs
 * @returns {object} the new state for the Redux store
 */
export function handleTabChanged( state, action ) {
  const results = action.tab === 'Trends' ? state.results : defaultState.results
  return {
    ...state,
    results
  }
}

/**
 * Updates the state when an aggregations call is in progress
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the payload containing the key/value pairs
 * @returns {object} the new state for the Redux store
 */
export function trendsCallInProcess( state, action ) {
  return {
    ...state,
    activeCall: action.url,
    isLoading: true
  }
}

/**
 * handling errors from an aggregation call
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the payload containing the key/value pairs
 * @returns {object} new state for the Redux store
 */
export function processTrendsError( state, action ) {
  return {
    ...state,
    activeCall: '',
    error: processErrorMessage( action.error ),
    isLoading: false,
    results: {
      dateRangeArea: [],
      dateRangeBrush: [],
      dateRangeLine: [],
      issue: [],
      product: []
    }
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
    chartType: action.chartType,
    tooltip: false
  }
}

/**
 * Handler for the update data lens action
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the command being executed
 * @returns {object} the new state for the Redux store
 */
export function updateDataLens( state, action ) {
  const { lens } = action
  const chartType = lens === 'Overview' ? 'line' : state.chartType
  // make sure it's a line chart if it's overview
  return {
    ...state,
    chartType,
    focus: '',
    lens,
    subLens: getSubLens( lens ),
    tooltip: false
  }
}

/**
 * Handler for the update sub lens action
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the command being executed
 * @returns {object} the new state for the Redux store
 */
export function updateDataSubLens( state, action ) {
  return {
    ...state,
    subLens: action.subLens
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
    focus: action.focus,
    tooltip: false
  }
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
  const processed = Object.assign( {}, defaultState )

  // Handle flag filters
  const filters = [ 'chartType', 'focus', 'lens', 'subLens' ]
  for ( const val of filters ) {
    if ( params[val] ) {
      processed[val] = params[val]
    }
  }

  return processed
}

/**
 * Handler for the tooltipUpdate action
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the command being executed
 * @returns {object} the new state for the Redux store
 */
function updateTooltip( state, action ) {
  const tooltip = action.value || false

  // need to merge in the actual viewed state
  if ( tooltip ) {
    tooltip.title = getTooltipTitle( tooltip.date, tooltip.interval,
      tooltip.dateRange, true )

    /* istanbul ignore else */
    if ( tooltip.values ) {
      tooltip.values.forEach( o => {
        o.colorIndex = Object.values( colors.DataLens )
          .indexOf( state.colorMap[o.name] ) || 0
        // make sure all values have a value
        o.value = coalesce( o, 'value', 0 )
      } )

      let total = 0
      total = tooltip.values.reduce( ( accumulator, currentValue ) =>
        accumulator + currentValue.value, total )
      tooltip.total = total
    }
  }

  return {
    ...state,
    tooltip
  }
}

/**
 * reset the filters selected for the focus too
 *
 * @param {object} state the current state in the Redux store
 * @returns {object} the new state for the Redux store
 */
export function removeAllFilters( state ) {
  return {
    ...state,
    focus: ''
  }
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

  handlers[actions.CHART_TYPE_CHANGED] = updateChartType
  handlers[actions.DATA_LENS_CHANGED] = updateDataLens
  handlers[actions.DATA_SUBLENS_CHANGED] = updateDataSubLens
  handlers[actions.FILTER_ALL_REMOVED] = removeAllFilters
  handlers[actions.FOCUS_CHANGED] = changeFocus
  handlers[actions.TAB_CHANGED] = handleTabChanged
  handlers[actions.TRENDS_API_CALLED] = trendsCallInProcess
  handlers[actions.TRENDS_FAILED] = processTrendsError
  handlers[actions.TRENDS_RECEIVED] = processTrends
  handlers[actions.TREND_TOGGLED] = toggleTrend
  handlers[actions.TRENDS_TOOLTIP_CHANGED] = updateTooltip
  handlers[actions.URL_CHANGED] = processParams

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

export default ( state = defaultState, action ) => {
  const newState = handleSpecificAction( state, action )
  return newState
}
