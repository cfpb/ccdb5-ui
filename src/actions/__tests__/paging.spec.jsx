jest.mock('../complaints');

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as sut from '../paging'
import * as types from '../../constants'

describe('action:paging', () => {
  describe('pageChanged', () => {
    it('creates a simple action', () => {
        const expectedAction = {
          type: types.PAGE_CHANGED,
          page: 99
        }
        expect(sut.pageChanged(99)).toEqual(expectedAction)
    })
  })

  describe('sizeChanged', () => {
    it('creates a simple action', () => {
        const expectedAction = {
          type: types.SIZE_CHANGED,
          size: 50
        }
        expect(sut.sizeChanged(50)).toEqual(expectedAction)
    })
  })

  describe('sortChanged', () => {
    it('creates a simple action', () => {
        const expectedAction = {
          type: types.SORT_CHANGED,
          sort: 'foo'
        }
        expect(sut.sortChanged('foo')).toEqual(expectedAction)
    })
  })

  describe('compound actions', () => {
    let middlewares, mockStore, store

    beforeEach(() => {
      middlewares = [thunk]
      mockStore = configureMockStore(middlewares)
      store = mockStore({ })      
    })

    describe('changePage', () => {
      it('executes a chain of actions', () => {
        const expectedActions = [
          { type: types.PAGE_CHANGED, page: 99 },
          { type: 'getComplaintsMock' }
        ]

        store.dispatch(sut.changePage(99))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    describe('changeSize', () => {
      it('executes a chain of actions', () => {
        const expectedActions = [
          { type: types.SIZE_CHANGED, size: 50 },
          { type: 'getComplaintsMock' }
        ]

        store.dispatch(sut.changeSize(50))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    describe('changeSort', () => {
      it('executes a chain of actions', () => {
        const expectedActions = [
          { type: types.SORT_CHANGED, sort: 'foo' },
          { type: 'getComplaintsMock' }
        ]

        store.dispatch(sut.changeSort('foo'))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })
})