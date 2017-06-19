import target from '../query'
import * as types from '../../constants'

describe('reducer:query', () => {
  it('has a default state', () => {
    expect(target(undefined, {})).toEqual({
        searchText: '',
        from: 0,
        size: 10
      })
  })

  it('handles SEARCH_TEXT actions', () => {
    const action = {
      type: types.SEARCH_TEXT,
      searchText: 'foo',
      searchType: 'bar',
    }
    const state = {
      from: 80,
      size: 100
    }
    expect(target(state, action)).toEqual({
        searchText: 'foo',
        from: 0,
        size: 100
      })
  })
})