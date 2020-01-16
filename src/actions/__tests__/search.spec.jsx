import { REQUERY_ALWAYS } from '../../constants'
import * as sut from '../search'

describe('action:search', () => {
  describe('searchChanged', () => {
    it('creates a simple action', () => {
        const searchText = 'foo'
        const searchField = 'qaz'
        const expectedAction = {
          type: sut.SEARCH_CHANGED,
          searchText,
          searchField,
          requery: REQUERY_ALWAYS
        }
        expect(sut.searchChanged(searchText, searchField)).toEqual(expectedAction)
    })
  })
})
