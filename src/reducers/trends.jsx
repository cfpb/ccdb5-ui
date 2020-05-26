// reducer for the Map Tab
import * as colors from '../constants/colors'
import {
  formatPercentage, getSubKeyName, isDateEqual, processErrorMessage
} from '../utils'
import { getLastDate, getTooltipTitle } from '../utils/chart'
import actions from '../actions'
import { compareDates } from '../utils/formatDate'
import { GEO_NORM_NONE } from '../constants'

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
  colorMap: {},
  filterNames: [],
  focus: false,
  expandedTrends: [],
  isLoading: false,
  lastDate: false,
  lens: 'Overview',
  subLens: '',
  dataNormalization: GEO_NORM_NONE,
  results: {
    dateRangeArea: [],
    dateRangeLine: [],
    dateRangeBrush: [],
    issue: [],
    product: []
  },
  tooltip: false
}

// ----------------------------------------------------------------------------
// Helpers
/* eslint-disable complexity */
/**
 * helper function to get under eslint limit
 * @param {object} b bucket containing interval_diff value
 * @returns {float} the formatted percentage we need
 */
export function getPctChange( b ) {
  // ( interval_diff / (doc_count + ( - interval_diff)) )*100
  const interval_diff = Number( b.interval_diff.value )
  const change = b.doc_count - interval_diff

  if ( interval_diff === 0 ) {
    return interval_diff
  }

  if ( change === 0 ) {
    // for some reason its changing to NaN
    return interval_diff > 0 ? 999999 : -999999
  }

  const delta = interval_diff / change
  return formatPercentage( delta )
}

/**
 * helper function to get sum of the Other category to hide if zero
 * @param {array} buckets the buckets for each data point
 * @param {string} name the buckets for each data point
 * @returns {number} sum of the other buckets
 */
function sumBucket( buckets, name ) {
  return buckets.filter( o => o.name === name )
    .reduce( ( accumulator, currentValue ) =>
      accumulator + currentValue.value, 0 )
}

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
    pctChange: Number( obj.pctChange ),
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
    console.log( o )
    // only take first 10 of the buckets for processing
    const reverseBuckets = o.trend_period.buckets.reverse()
    console.log( reverseBuckets )
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

function processLineData( aggregations ) {
  const buckets = aggregations.dateRangeArea.dateRangeArea.buckets
  return {
    dataByTopic: [
      {
        topic: 'Complaints',
        dashed: false,
        show: true,
        dates: buckets.map( o => ( {
          date: o.key_as_string,
          value: o.doc_count
        } ) ),
        topicName: 'Complaints'
      }
    ]
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
    const subBucket = trend_period.buckets[1] || trend_period.buckets[0]

    bucket.pctOfSet = formatPercentage( bucketDC / docCount )
    bucket.num_results = docCount

    if ( subBucket && subBucket.interval_diff ) {
      bucket.pctChange = getPctChange( subBucket )
    }
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

  if ( lens === 'Overview' ) {
    colScheme.Complaints = colors.BriteCharts.medium
  }

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
  // If only date updates, don't wipe out the collection
  const results = { ...state.results }
  const lens = state.lens
  const aggregations = action.data.aggregations
  const tooltip = false
  let lastDate = state.lastDate

  for ( const k in aggregations ) {
    // const v = aggregations
    //
    // console.log( k )
    // console.log( aggregations )

    // agg[drb][drb]
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

        if ( lens === 'Overview' ) {
          results.dateRangeLine = processLineData( aggregations )
        } else {
          results[k] = processAreaData( state, aggregations, buckets )
          // initialize tooltip too
          // const tip = getLastDate( results[k], state )
          // console.log( tip )
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

  const colorMap = getColorScheme( state.lens, results.dateRangeArea )

  return {
    ...state,
    colorMap,
    isLoading: false,
    lastDate,
    results,
    tooltip
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
      console.log( k )
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
export function statesCallInProcess( state, action ) {
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
  console.log( action )
  return {
    ...state,
    activeCall: '',
    issue: [],
    error: processErrorMessage( action.error ),
    isLoading: false,
    product: []
  }
}


/**
 * Handler for the update filter data normalization action
 *
 * @param {object} state the current state in the Redux store
 * @param {object} action the command being executed
 * @returns {object} the new state for the Redux store
 */
export function updateDateDataNormalization( state, action ) {
  let dataNormalization = state.dataNormalization
  if ( action.filterName === 'company_received' ) {
    if ( action.minDate || action.maxDate ) {
      dataNormalization = GEO_NORM_NONE
    }
  }

  return {
    ...state,
    dataNormalization
  }
}

/**
 * Handler for the update data normalization action
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
  if ( params.lens ) {
    processed.lens = params.lens
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

  handlers[actions.DATA_LENS_CHANGED] = updateDataLens
  handlers[actions.TAB_CHANGED] = handleTabChanged
  handlers[actions.TRENDS_API_CALLED] = statesCallInProcess
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
