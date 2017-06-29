jest.mock('../url');

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { filterChanged, filterToggle } from '../filter'
import * as types from '../../constants'

describe('action:filterActions', () => {
  describe('filterToggled', () => {
    it('creates a simple action', () => {
        const filterName = 'timely'
        const filterValue = 'Yes'
        const expectedAction = {
          type: types.FILTER_CHANGED,
          filterName,
          filterValue
        }
        expect(filterToggle(filterName, filterValue)).toEqual( expectedAction );
    })
  })

  describe('filterChanged', () => {
    it('executes a chain of actions', () => {
      const expectedActions = [
        { type: types.FILTER_CHANGED, filterName: 'timely', filterValue: 'Yes'},
        { type: 'announceURLChangedMock' }
      ]

      const middlewares = [thunk]
      const mockStore = configureMockStore(middlewares)
      const store = mockStore({ })

      store.dispatch(filterChanged({filterName: 'timely', filterValue: 'Yes'}) )
      console.error("STORE GETACTIONS: ", store.getActions());
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
