jest.mock('../complaints');

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as sut from '../filter'
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
        expect(sut.filterToggle(filterName, filterValue)).toEqual( expectedAction );
    })
  })

  describe('filterRemoved', () => {
    it('creates a simple action', () => {
        const filterName = 'timely'
        const filterValue = 'Yes'
        const expectedAction = {
          type: types.FILTER_REMOVED,
          filterName,
          filterValue
        }
        expect(sut.filterRemoved(filterName, filterValue)).toEqual( expectedAction );
    })
  })

  describe('filterAllRemoved', () => {
    it('creates a simple action', () => {
        const expectedAction = {
          type: types.FILTER_ALL_REMOVED
        }
        expect(sut.filterAllRemoved()).toEqual( expectedAction );
    })
  })

  describe('filterMultipleAdded', () => {
    it('creates a simple action', () => {
        const filterName = 'issue'
        const values = ['Mo Money', 'Mo Problems']
        const expectedAction = {
          type: types.FILTER_MULTIPLE_ADDED,
          filterName,
          values
        }
        expect(sut.filterMultipleAdded(filterName, values))
          .toEqual( expectedAction );
    })
  })

  describe('filterMultipleRemoved', () => {
    it('creates a simple action', () => {
        const filterName = 'issue'
        const values = ['Mo Money', 'Mo Problems']
        const expectedAction = {
          type: types.FILTER_MULTIPLE_REMOVED,
          filterName,
          values
        }
        expect(sut.filterMultipleRemoved(filterName, values))
          .toEqual( expectedAction );
    })
  })

  describe('compound actions', () => {
    let middlewares, mockStore, store

    beforeEach(() => {
      middlewares = [thunk]
      mockStore = configureMockStore(middlewares)
      store = mockStore({ })      
    })

    describe('addMultipleFilters', () => {
      it('executes a chain of actions', () => {
        const filterName = 'issue'
        const values = ['Mo Money', 'Mo Problems']
        const expectedActions = [
          { type:
            types.FILTER_MULTIPLE_ADDED,
            filterName,
            values
          },
          { type: 'getComplaintsMock' }
        ]

        store.dispatch(sut.addMultipleFilters(filterName, values))
        expect(store.getActions()).toEqual(expectedActions)
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

        store.dispatch(sut.filterChanged(filterName, filterValue))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    describe('removeFilter', () => {
      it('executes a chain of actions', () => {
        const filterName = 'timely'
        const filterValue = 'Yes'
        const expectedActions = [
          { type: types.FILTER_REMOVED, filterName, filterValue},
          { type: 'getComplaintsMock' }
        ]

        store.dispatch(sut.removeFilter(filterName, filterValue))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    describe('removeAllFilters', () => {
      it('executes a chain of actions', () => {
        const expectedActions = [
          { type: types.FILTER_ALL_REMOVED},
          { type: 'getComplaintsMock' }
        ]

        store.dispatch(sut.removeAllFilters())
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    describe('removeMultipleFilters', () => {
      it('executes a chain of actions', () => {
        const filterName = 'issue'
        const values = ['Mo Money', 'Mo Problems']
        const expectedActions = [
          { type:
            types.FILTER_MULTIPLE_REMOVED,
            filterName,
            values
          },
          { type: 'getComplaintsMock' }
        ]

        store.dispatch(sut.removeMultipleFilters(filterName, values))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })
})
