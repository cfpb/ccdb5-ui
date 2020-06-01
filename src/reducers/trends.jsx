// reducer for the Map Tab
import * as colors from '../constants/colors'
import {
  coalesce, formatPercentage, getSubKeyName, processErrorMessage
} from '../utils'
import actions from '../actions'
import { getTooltipTitle } from '../utils/chart'
import { isDateEqual } from '../utils/formatDate'

const filterMap = {
  'Collection': 'Collections',
  'Company': 'Matched Company',
  'Issue': 'Issue',
  'Sub-issue': 'Sub-Issue',
  'Product': 'Product',
  'Sub-product': 'Sub-Product'
}

const defaultSubLens = {
  Overview: '',
  Product: 'Sub-product',
  Issue: 'Sub-issue',
  Company: 'Product',
  Collection: 'Product'
}

export const defaultState = {
  activeCall: '',
  chartType: 'line',
  colorMap: {},
  expandedTrends: [],
  filterNames: [],
  focus: false,
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
  tooltip: false
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
  // console.log( agg )
  const { expandedTrends, filterNames } = state
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

    // console.log( item )
    // console.log( subKeyName )
    // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_omit
    // Create a parent row.
    // remove the lodash omit since it is deprecated in lodash5
    const tempItem = Object.assign( {}, item )
    delete tempItem[subKeyName]
    list.push( tempItem )

    /* istanbul ignore else */
    if ( item[subKeyName] && item[subKeyName].buckets ) {
      list.push( item[subKeyName].buckets )
    }
  }

  const nameMap = []

  // return list
  return list.flat().map( obj => getD3Names( obj, nameMap, expandedTrends ) )
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

  return {
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

function getLastDateForTooltip( buckets ) {
  return buckets[buckets.length - 1].key_as_string
}

/**
 * processes the stuff for the area chart, combining them if necessary
 * @param {object} state redux state
 * @param {object} aggregations coming from the trends api
 * @param {Array} buckets contains trend_period data
 * @returns {object} the data areas for the stacked area chart
 */
function processAreaData( state, aggregations, buckets ) {
  const mainName = state.lens === 'Overview' ? 'Complaints' : 'Other'
  // overall buckets
  let compBuckets = buckets.map(
    obj => ( {
      name: mainName,
      value: obj.doc_count,
      date: new Date( obj.key_as_string )
    } )
  )

  // reference buckets to backfill zero values
  const refBuckets = Object.assign( {}, compBuckets )
  const lens = state.focus ? state.subLens : state.lens
  const filter = filterMap[lens].toLowerCase()
  const trendResults = aggregations[filter][filter]
    .buckets.slice( 0, 10 )
  for ( let i = 0; i < trendResults.length; i++ ) {
    const o = trendResults[i]
    // console.log( o )
    // only take first 10 of the buckets for processing
    const reverseBuckets = o.trend_period.buckets.reverse()
    // console.log( reverseBuckets )
    for ( let j = 0; j < reverseBuckets.length; j++ ) {
      const p = reverseBuckets[j]
      compBuckets.push( {
        name: o.key,
        value: p.doc_count,
        date: new Date( p.key_as_string )
      } )

      // delete total from that date
      /* eslint max-nested-callbacks: ["error", 4] */
      const pos = compBuckets
        .findIndex( i => i.name === mainName &&
          isDateEqual( i.date, p.key_as_string ) )

      /* istanbul ignore else */
      if ( pos > -1 ) {
        // subtract the value from total, so we calculate the "Other" bin
        compBuckets[pos].value -= p.doc_count
      }
    }

    // we're missing a bucket, so fill it in.
    if ( o.trend_period.buckets.length !== Object.keys( refBuckets ).length ) {
      // console.log( refBuckets )
      for ( const k in refBuckets ) {
        const obj = refBuckets[k]
        const datePoint = compBuckets
          .filter( f => f.name === o.key )
          .find( f => isDateEqual( f.date, obj.date ) )

        if ( !datePoint ) {
          compBuckets.push( {
            name: o.key,
            value: 0,
            date: new Date( obj.date )
          } )
        }
      }
    }
  }

  return compBuckets
}

function processLineData( lens, aggregations ) {
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
    const lensKey = lens.toLowerCase()
    const issueBuckets = aggregations[lensKey][lensKey].buckets
    for ( let i = 0; i < issueBuckets.length; i++ ) {
      dataByTopic.push( {
        topic: issueBuckets[i].key,
        topicName: issueBuckets[i].key,
        dashed: false,
        show: true,
        dates: issueBuckets[i].trend_period.buckets.reverse().map( o => ( {
          date: o.key_as_string,
          value: o.doc_count
        } ) )
      } )
    }
  }
  return {
    dataByTopic
  }
}

/**
 * processes the aggregation buckets to get the deltas for rows
 * @param {object} bucket subagg bucket with difference intervals
 * @param {string} k key, issue, product etc
 * @param {integer} docCount overall agg count of the results being returned
 */
export function processTrendPeriod( bucket, k, docCount ) {
  // v[k].buckets[i] = bucket
  const trend_period = bucket.trend_period

  /* istanbul ignore else */
  if ( trend_period ) {
    const bucketDC = bucket.doc_count
    bucket.pctOfSet = formatPercentage( bucketDC / docCount )
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
  const colScheme = {},
    colorScheme = colors.DataLens,
    uniqueNames = [ ...new Set( rowNames.map( item => item.name ) ) ]
      .filter( o => o !== 'Other' )

  for ( let i = 0; i < uniqueNames.length; i++ ) {
    const n = uniqueNames[i]
    colScheme[n] = i < 10 ? colorScheme[i] : colorScheme[10]
  }

  colScheme.Complaints = colors.BriteCharts.medium
  colScheme.Other = colors.DataLens[10]
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
  const { lens, results } = state
  const aggregations = action.data.aggregations

  let lastDate

  for ( const k in aggregations ) {
    /* istanbul ignore else */
    if ( aggregations[k] && aggregations[k][k] && aggregations[k][k].buckets ) {
      // set to zero when we are not using focus Lens
      const buckets = aggregations[k][k].buckets
      for ( let i = 0; i < buckets.length; i++ ) {
        const docCount = aggregations[k].doc_count
        // console.log(docCount)
        processTrendPeriod( buckets[i], k, docCount )
      }

      if ( k === 'dateRangeBrush' ) {
        results[k] = buckets.map(
          obj => ( {
            date: new Date( obj.key_as_string ),
            value: obj.doc_count
          } )
        )
      } else if ( k === 'dateRangeArea' ) {
        lastDate = getLastDateForTooltip( buckets )
        results.dateRangeLine = processLineData( lens, aggregations )

        if ( lens !== 'Overview' ) {
          results[k] = processAreaData( state, aggregations, buckets )
        }
      } else {
        results[k] = processBucket( state, buckets )
      }
    }
  }

  // prune off the results that aren't being returned in aggregations
  const aggKeys = Object.keys( aggregations )
  for ( const k in results ) {
    // temp placeholder...
    if ( !aggKeys.includes( k ) && k !== 'dateRangeLine' ) {
      delete results[k]
    }
  }

  const colorMap = getColorScheme( lens, results.dateRangeArea )

  return {
    ...state,
    activeCall: '',
    colorMap,
    isLoading: false,
    lastDate,
    results,
    tooltip: false
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
      // console.log( k )
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
  return {
    ...state,
    lens: action.lens
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
  const filters = [ 'lens', 'subLens' ]
  for ( let val of filters ) {
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
      tooltip.dateRange )

    /* istanbul ignore else */
    if ( tooltip.values ) {
      tooltip.values.forEach( o => {
        o.colorIndex = Object.values( colors.DataLens )
          .indexOf( state.colorMap[o.name] ) || 0
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
