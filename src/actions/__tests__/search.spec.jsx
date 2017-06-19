import search from '../search'
import * as types from '../../constants'

it('creates a search action', () => {
    const searchText = 'foo'
    const searchType = 'qaz'
    const expectedAction = {
      type: types.SEARCH_TEXT,
      searchText,
      searchType
    }
    expect(search(searchText, searchType)).toEqual(expectedAction)
})
