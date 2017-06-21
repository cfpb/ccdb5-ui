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

  it('handles SEARCH_CHANGED actions', () => {
    const action = {
      type: types.SEARCH_CHANGED,
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

  it('handles PAGE_CHANGED actions', () => {
    const action = {
      type: types.PAGE_CHANGED,
      page: 2
    }
    const state = {
      size: 100
    }
    expect(target(state, action)).toEqual({
        from: 100,
        size: 100
      })
  })
})