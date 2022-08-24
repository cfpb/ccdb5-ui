import * as types from '../constants'
import dayjs from 'dayjs'

// ----------------------------------------------------------------------------
export const showCompanyOverLay = ( lens, companyFilters, isLoading ) => {
  if ( isLoading ) {
    return false
  }

  // we need to show the companyOverlay if:
  // lens === 'Company' AND there are no company filters
  if ( lens === 'Company' ) {
    return !companyFilters || companyFilters.length === 0
  }

  return false
}

/* eslint-disable-next-line no-extra-parens */
export const getSubLens = lens => {
  if ( !lens ) {
    return ''
  }

  switch ( lens ) {
    case 'Overview':
      return ''
    case 'Company':
      return 'product'
    default:
      return 'sub_' + lens.toLowerCase()
  }
}

/**
 * helper function to strip out the "Other" data points from stacked area if
 * they don't have any values
 * @param {array} buckets contains all of the date points for the stacked area
 * @returns {array} cleaned up array or not
 */
export const pruneOther = buckets => {
  const sumOther = buckets
    .filter( o => o.name === 'Other' )
    .reduce( ( prev, cur ) => prev + cur.value, 0 )

  return sumOther > 0 ? buckets : buckets.filter( o => o.name !== 'Other' )
}

export const isGreaterThanYear = ( from, to ) => {
  const a = dayjs( from )
  const b = dayjs( to )
  return b.diff( a, 'days' ) > 366
}

/**
 * gets the valid intervals based on dates selected.
 * get rid of Day if range > 1yr
 * @param {object} from date
 * @param {object} to date
 * @returns {array} array of date intervals
 */
export const getIntervals = ( from, to ) =>
  types.dateIntervals.map( o => ( {
    name: o,
    disabled: isGreaterThanYear( from, to ) && o === 'Day'
  } ) )

/**
 * trigger this after a user clicks a focus.  we scroll to the select box
 * so that users don't get a blank wall of content
 */
export const scrollToFocus = () => {
  const lensSelect = document.getElementById( 'search-summary' )
  if ( lensSelect ) {
    lensSelect.scrollIntoView()
  }
}
