jest.mock('../complaints');

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import search, { searchUpdating } from '../search'
import * as types from '../../constants'

describe('action:search', () => {
  describe('searchUpdating', () => {
    it('creates a simple action', () => {
        const searchText = 'foo'
        const searchType = 'qaz'
        const expectedAction = {
          type: types.SEARCH_TEXT,
          searchText,
          searchType
        }
        expect(searchUpdating(searchText, searchType)).toEqual(expectedAction)
    })
  })

  describe('search', () => {
    it('executes a chain of actions', () => {
      const expectedActions = [
        { type: types.SEARCH_TEXT, searchText: 'foo', searchType: 'bar' },
        { type: 'getComplaintsMock' }
      ]

      const middlewares = [thunk]
      const mockStore = configureMockStore(middlewares)
      const store = mockStore({ })

      store.dispatch(search('foo', 'bar'))
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})

