// ----------------------------------------------------------------------------
/* eslint-disable no-mixed-operators */
import { clampDate, slugify } from '../utils'
import {
  formatDateView
} from './formatDate'

import moment from 'moment'

export const getTooltipDate = ( inputDate, dateRange ) => {
  const returnDate = clampDate( inputDate, dateRange.from, dateRange.to )
  return formatDateView( returnDate )
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

/**
 * helper to generate chart name for row chart based on trends
 * @param {array} rowNames passed from trends.results reducer
 * @param {object} colorMap of the chart for display
 * @returns {array} the color scheme [blue, red, yellow, etc]
 */
export const getColorScheme = ( rowNames, colorMap ) => {
  return rowNames.map( o => {
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

    return '#20aa3f'
  } )
}

export const processRows = ( filters, rows, colorMap ) => {
  let data = rows
  // only include the bars that are explicitly listed in the filters
  if ( filters && filters.length ) {
    data = data.filter( o => {
      if ( o.parent ) {
        return filters.includes( slugify( o.parent, o.name ) )
      }

      return filters.includes( o.name )
    } )
  }

  data = data.filter( o => o.visible )

  const colorScheme = getColorScheme( data, colorMap )

  return {
    colorScheme,
    data: data.filter( o => o.visible )
  }
}
