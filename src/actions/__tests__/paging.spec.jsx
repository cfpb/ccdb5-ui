jest.mock('../complaints');

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { changePage, pageChanged } from '../paging'
import * as types from '../../constants'

describe('action:paging', () => {
  describe('pageChanged', () => {
    it('creates a simple action', () => {
        const expectedAction = {
          type: types.PAGE_CHANGED,
          page: 99
        }
        expect(pageChanged(99)).toEqual(expectedAction)
    })
  })

  describe('changePage', () => {
    it('executes a chain of actions', () => {
      const expectedActions = [
        { type: types.PAGE_CHANGED, page: 99 },
        { type: 'getComplaintsMock' }
      ]

      const middlewares = [thunk]
      const mockStore = configureMockStore(middlewares)
      const store = mockStore({ })

      store.dispatch(changePage(99))
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
