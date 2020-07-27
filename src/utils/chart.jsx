// ----------------------------------------------------------------------------
/* eslint-disable no-mixed-operators, camelcase */
import { formatDateView, isDateEqual } from './formatDate'
import { clampDate } from '../utils'

import moment from 'moment'

export const getLastDate = ( dataSet, config ) => {
  // take in array of data points
  // early exit
  if ( !dataSet || dataSet.length === 0 ) {
    return null
  }

  const lastDate = config.lastDate
  const lastPointValues = dataSet.filter( o => isDateEqual( o.date, lastDate ) )
  return {
    key: lastDate,
    date: lastDate,
    dateRange: config.dateRange,
    interval: config.interval,
    values: lastPointValues
  }
}

export const getLastLineDate = ( dataSet, config ) => {
  // take in array of data points
  if ( !dataSet || !dataSet.dataByTopic || dataSet.dataByTopic.length === 0 ) {
    return null
  }

  const lastDate = config.lastDate
  const values = dataSet.dataByTopic.map( o => {
    const lastPoint = o.dates.find( v => isDateEqual( v.date, lastDate ) )
    const value = lastPoint ? lastPoint.value : 0
    return {
      name: o.topic,
      date: lastDate,
      value
    }
  } )

  const lastPoint = {
    key: lastDate,
    date: lastDate,
    dateRange: config.dateRange,
    interval: config.interval,
    values
  }
  return lastPoint
}


export const getTooltipDate = ( inputDate, dateRange ) => {
  const returnDate = clampDate( inputDate, dateRange.from, dateRange.to )
  return formatDateView( returnDate )
}

export const getTooltipTitle = ( inputDate, interval, dateRange, external ) => {
  /* eslint complexity: ["error", 6] */
  interval = interval.toLowerCase()
  const startDate = getTooltipDate( inputDate, dateRange )

  let endDate

  switch ( interval ) {
    case 'week':
      endDate = moment( new Date( inputDate ) )
        .add( 1, interval ).startOf( interval )
      break
    case 'quarter':
      endDate = moment( new Date( inputDate ) )
        .add( 1, interval )
        .endOf( interval )
        .subtract( 1, 'day' )
      break
    case 'month':
    default:
      endDate = moment( new Date( inputDate ) )
        .add( 1, interval )
        .subtract( 1, 'day' )
      break
  }

  endDate = getTooltipDate( endDate, dateRange )

  if ( interval === 'day' ) {
    return `Date: ${ endDate }`
  }

  return external ? `Date range: ${ startDate } - ${ endDate }` :
    `${ startDate } - ${ endDate }`
}

/**
 * helper to generate chart name for row chart based on trends
 * @param {array} rowNames passed from trends.results reducer
 * @param {object} colorMap of the chart for display
 * @param {string} lens determines which colors to use for defaults
 * @returns {array} the color scheme [blue, red, yellow, etc]
 */
export const getColorScheme = ( rowNames, colorMap, lens ) =>
  rowNames.map( o => {
    if ( !colorMap ) {
      return '#20aa3f'
    }
    // bad data. Some titles can appears twice in the product data
    const name = o.name.trim()
    const parent = o.parent ? o.parent.trim() : ''
    // parent should have priority
    if ( colorMap[parent] ) {
      return colorMap[parent]
    } else if ( colorMap[name] ) {
      return colorMap[name]
    }

    // return default grey when it's data lens  and not in area/line chart
    // #a2a3a4
    return lens === 'Overview' ? '#20aa3f' : '#a2a3a4'
  } )


/**
 * helper function to get d3 bar chart data
 * @param {object} obj rowdata we are processing
 * @param {array} nameMap list of names we are keeping track of
 * @returns {object} the rowdata for row chart
 */
export const getD3Names = ( obj, nameMap ) => {
  let name = obj.key
  // D3 doesnt allow dupe keys, so we have to to append
  // spaces so we have unique keys
  while ( nameMap[name] ) {
    name += ' '
  }

  nameMap[name] = true

  return obj.splitterText ? obj : {
    hasChildren: Boolean( obj.hasChildren ),
    isNotFilter: false,
    isParent: Boolean( obj.isParent ),
    name: name,
    value: Number( obj.doc_count ),
    parent: obj.parent || false,
    // this adjusts the thickness of the parent or child bars
    width: obj.parent ? 0.4 : 0.5
  }
}


export const processRows = ( rows, colorMap, lens, expandedRows ) => {
  if ( rows ) {
    let data = rows
    data = data.filter( o => o.isParent || expandedRows.includes( o.parent ) )
    const colorScheme = getColorScheme( data, colorMap, lens )

    return {
      colorScheme,
      data
    }
  }

  return {
    colorScheme: [],
    data: []
  }
}

/**
 * The api sends us the date buckets in older -> new order
 * however, in data lens / company aggregation it's reversed
 * we also need to fill any empty area buckets when dates are missing
 * @param {string} name bucket name
 * @param {array} buckets contains dates and value paired objects
 * @param {array} areaBuckets the reference dates we check against
 * @returns {array} the sorted array in old-> newest
 */
export const updateDateBuckets = ( name, buckets, areaBuckets ) => {
  // fill in empty zero values
  areaBuckets.forEach( o => {
    if ( !buckets.find( b => b.key_as_string === o.key_as_string ) ) {
      buckets.push( {
        name: name,
        doc_count: 0,
        key_as_string: o.key_as_string
      } )
    }
  } )

  return buckets
    // eslint-disable-next-line no-confusing-arrow, no-extra-parens
    .sort( ( a, b ) => ( a.key_as_string > b.key_as_string ) ? 1 : -1 )
    .map( o => ( {
      name: name,
      date: o.key_as_string,
      value: o.doc_count
    } ) )
}

export const externalTooltipFormatter = tooltip => {
  if ( !tooltip ) {
    return tooltip
  }
  const parts = tooltip.title.split( ':' )
  return {
    ...tooltip,
    heading: parts[0] + ':',
    date: parts[1] ? parts[1].trim() : ''
  }
}
