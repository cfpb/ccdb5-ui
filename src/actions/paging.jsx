import { PAGE_CHANGED, SIZE_CHANGED, SORT_CHANGED } from '../constants'
import { getComplaints } from './complaints'

// ----------------------------------------------------------------------------
// Simple actions

export function pageChanged( page ) {
  return {
    type: PAGE_CHANGED,
    page
  }
}

export function sizeChanged( size ) {
  console.assert( typeof size === 'number' )
  return {
    type: SIZE_CHANGED,
    size
  }
}

export function sortChanged( sort ) {
  return {
    type: SORT_CHANGED,
    sort
  }
}

// ----------------------------------------------------------------------------
// Compound actions

export function changePage( page ) {
  return dispatch => {
    dispatch( pageChanged( page ) )
    dispatch( getComplaints() )
  }
}

export function changeSize( size ) {
  return dispatch => {
    dispatch( sizeChanged( size ) )
    dispatch( getComplaints() )
  }
}

export function changeSort( sort ) {
  return dispatch => {
    dispatch( sortChanged( sort ) )
    dispatch( getComplaints() )
  }
}
