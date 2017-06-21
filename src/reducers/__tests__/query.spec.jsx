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

  describe('URL_CHANGED actions', () => {
    let action = null
    let state = null
    beforeEach(() => {
      action = {
        type: types.URL_CHANGED,
        params: {}
      }

      state = {
        searchText: '',
        from: 99,
        size: 99
      }
    })

    it('handles empty params', () => {
      expect(target(state, action)).toEqual(state)
    })

    it('converts some parameters to integers', () => {
      // Writing it this way helps with branch coverage
      action.params = { size: '100' }
      expect(target({}, action)).toEqual({ size: 100 })

      action.params = { from: '10' }
      expect(target({}, action)).toEqual({ from: 10 })
    })

    it('ignores unknown parameters', () => {
      action.params = {
        searchText: 'hello',
        foo: 'bar'
      }

      expect(target(state, action)).toEqual({
        searchText: 'hello',
        from: 99,
        size: 99
      })
    })
  })
})