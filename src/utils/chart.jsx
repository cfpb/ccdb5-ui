// ----------------------------------------------------------------------------
/* eslint-disable no-mixed-operators */
import {
  formatDateLocaleShort,
  formatDateView,
  isDateEqual
} from './formatDate'
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
