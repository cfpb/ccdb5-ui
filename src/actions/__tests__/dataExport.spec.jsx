jest.mock('../domUtils');

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as sut from '../dataExport'
import * as types from '../../constants'

const mockDomUtils = require('../domUtils')

describe('action:dataExport', () => {
  describe('showExportDialog', () => {
    it('creates a simple action', () => {
        const expectedAction = {
          type: types.MODAL_SHOWN,
          modalType: types.MODAL_TYPE_DATA_EXPORT,
          modalProps: {}
        }
        expect(sut.showExportDialog()).toEqual(expectedAction)
    })
  })

  describe('compound actions', () => {
    let middlewares, mockStore, store

    beforeEach(() => {
      middlewares = [thunk]
      mockStore = configureMockStore(middlewares)
      store = mockStore({
        query: {
          size: 10
        }
      })

      mockDomUtils.buildLink.mockReset()
      mockDomUtils.simulateClick.mockReset()
    })

    describe('exportAllResults', () => {
      it('executes a chain of actions', () => {
        const expectedActions = []

        store.dispatch(sut.exportAllResults('json'))
        expect(store.getActions()).toEqual(expectedActions)
        expect(mockDomUtils.buildLink).toHaveBeenCalledWith(
          expect.stringMatching(/.*s6ew-h6mp.*/),
          'download.json'
        )
        expect(mockDomUtils.simulateClick).toHaveBeenCalled()
      })
    })

    describe('exportSomeResults', () => {
      it('executes a chain of actions', () => {
        const expectedActions = []

        store.dispatch(sut.exportSomeResults('csv', 11111))
        expect(store.getActions()).toEqual(expectedActions)
        expect(mockDomUtils.buildLink).toHaveBeenCalledWith(
          '@@API?format=csv&no_aggs=true&size=11111',
          'download.csv'
        )
        expect(mockDomUtils.simulateClick).toHaveBeenCalled()
      })
    })

    describe('visitSocrata', () => {
      it('executes a chain of actions', () => {
        const expectedActions = [
          { type: types.MODAL_HID }
        ]

        store.dispatch(sut.visitSocrata())
        expect(store.getActions()).toEqual(expectedActions)
        expect(mockDomUtils.buildLink).toHaveBeenCalledWith(
          expect.stringMatching(/.*s6ew-h6mp.*/)
        )
        expect(mockDomUtils.simulateClick).toHaveBeenCalled()
      })
    })
  })
})
