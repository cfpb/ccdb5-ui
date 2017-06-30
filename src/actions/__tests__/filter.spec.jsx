jest.mock('../complaints');

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
      const filterName = 'timely'
      const filterValue = 'Yes'
      const expectedActions = [
        { type: types.FILTER_CHANGED, filterName, filterValue},
        { type: 'getComplaintsMock' }
      ]

      const middlewares = [thunk]
      const mockStore = configureMockStore(middlewares)
      const store = mockStore({ })

      store.dispatch(filterChanged(filterName, filterValue) )
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
