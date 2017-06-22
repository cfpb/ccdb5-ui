import { PAGE_CHANGED } from '../constants'
import { getComplaints } from './complaints'

export function pageChanged(page) {
  return {
    type: PAGE_CHANGED,
    page
  }
}

export function changePage(page) {
  return dispatch => {
      dispatch(pageChanged(page))
      dispatch(getComplaints())
  }
}