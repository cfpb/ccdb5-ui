import { SEARCH_TEXT } from '../constants'

export default function search(searchText, searchType) {
  return {
    type: SEARCH_TEXT,
    searchText,
    searchType
  }
}