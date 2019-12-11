import { REQUERY_HITS_ONLY } from '../../constants'
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
          requery: REQUERY_HITS_ONLY
        }
        expect(sut.searchChanged(searchText, searchField)).toEqual(expectedAction)
    })
  })
})
