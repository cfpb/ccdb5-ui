import { PAGE_CHANGED } from '../constants'

export function changePage(page) {
  return {
    type: PAGE_CHANGED,
    page
  }
}
