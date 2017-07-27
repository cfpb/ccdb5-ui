jest.mock('../complaints');

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import search, { searchChanged } from '../search'
import * as types from '../../constants'

describe('action:search', () => {
  describe('searchChanged', () => {
    it('creates a simple action', () => {
        const searchText = 'foo'
        const searchField = 'qaz'
        const expectedAction = {
          type: types.SEARCH_CHANGED,
          searchText,
          searchField
        }
        expect(searchChanged(searchText, searchField)).toEqual(expectedAction)
    })
  })

  describe('search', () => {
    it('executes a chain of actions', () => {
      const expectedActions = [
        { type: types.SEARCH_CHANGED, searchText: 'foo', searchField: 'bar' },
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
