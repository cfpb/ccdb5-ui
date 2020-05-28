// ----------------------------------------------------------------------------
/* eslint-disable no-mixed-operators */
import { clampDate, slugify } from '../utils'
import {
  formatDateLocaleShort,
  formatDateView,
  isDateEqual
} from './formatDate'

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

export const getTooltipDate = ( inputDate, dateRange ) => {
  const returnDate = clampDate( inputDate, dateRange.from, dateRange.to )
  return formatDateView( returnDate )
}

export const getTipDate = ( endDate, interval ) => {
  /* eslint complexity: ["error", 6] */
  interval = interval.toLowerCase()

  let startDate

  switch ( interval ) {
    case 'week':
      startDate = moment( new Date( endDate ) )
        .subtract( 1, interval )
        .startOf( interval )
      break
    case 'quarter':
      startDate = moment( new Date( endDate ) )
        .subtract( 1, interval )
        .endOf( interval )
      break
    case 'month':
    default:
      startDate = moment( new Date( endDate ) )
        .subtract( 1, interval )
        .endOf( interval )
      break
  }

  return formatDateLocaleShort( startDate )
}

export const getTooltipTitle = ( inputDate, interval, dateRange ) => {
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

  return interval === 'day' ? endDate : `${ startDate } - ${ endDate }`
}

export const processBars = ( filters = [], rows = [], colorMap = false ) => {
  let data = rows
  if ( filters && filters.length ) {
    data = data.filter( o => {
      if ( o.parent ) {
        return filters.includes( slugify( o.parent, o.name ) )
      }

      return filters.includes( o.name )
    } )
  }

  data = data.filter( o => o.visible )

  const colorScheme = data
    .map( o => {
      if ( !colorMap ) {
        return '#20aa3f'
      }
      // console.log( o.name, o.parent, colorMap[o.name] )
      // bad data. Credit Reporting appears twice in the product data
      const name = o.name ? o.name.trim() : ''
      const parent = o.parent ? o.parent.trim() : ''
      // parent should have priority
      return colorMap[parent] ? colorMap[parent] : colorMap[name]
    } )

  return {
    colorScheme,
    data: data.filter( o => o.visible )
  }
}
