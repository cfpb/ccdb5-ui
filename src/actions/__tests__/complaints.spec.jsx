import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as sut from '../complaints'
import { AGGREGATIONS_API_CALLED } from '../complaints'
import { AGGREGATIONS_FAILED } from '../complaints'
import { AGGREGATIONS_RECEIVED } from '../complaints'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('action::complaints', () => {
  describe('getAggregations', () => {
    let onSuccess, onFail, store

    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation((url) => {
        expect(url).toContain(
          '@@API?foo'
        )

        return {
          then: (x) => {
            x({ json: () => ({})})
            return {
              then: (x) => {
                onSuccess = (data) => x(data)
                return {
                  catch: (y) => {onFail = y}
                }
              }
            }
          }
        }
      })

      store = mockStore({
        query: {
          date_received_min: new Date(2013, 1, 3),
          from: 0,
          has_narrative: true,
          queryString: '?foo',
          searchText: '',
          size: 10,
        },
        results: {
          activeCall: ''
        }
      })
    })

    it('calls the API', () => {
      store.dispatch(sut.getAggregations())
      expect(global.fetch).toHaveBeenCalled()
    })

    it('discards duplicate API calls', () => {
      const s = store.getState()
      s.results.loadingAggregations = true
      store = mockStore(s)

      store.dispatch(sut.getAggregations())
      expect(global.fetch).not.toHaveBeenCalled()
    })

    describe('when the API call is finished', () => {
      it('sends a simple action when data is received', () => {
        store.dispatch(sut.getAggregations())
        const expectedActions = [
          { type: sut.AGGREGATIONS_API_CALLED, url: expect.any(String) },
          { type: sut.AGGREGATIONS_RECEIVED, data: ['123']}
        ]
        onSuccess(['123'])
        expect(store.getActions()).toEqual(expectedActions)
      })

      it('sends a different simple action when an error occurs', () => {
        store.dispatch(sut.getAggregations())
        const expectedActions = [
          { type: sut.AGGREGATIONS_API_CALLED, url: expect.any(String) },
          { type: sut.AGGREGATIONS_FAILED, error: 'oops' }
        ]
        onFail('oops')
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })

  describe('getComplaints', () => {
    let onSuccess, onFail, store

    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation((url) => {
        expect(url).toContain(
          '@@API?foo'
        )

        return {
          then: (x) => {
            x({ json: () => ({})})
            return {
              then: (x) => {
                onSuccess = (data) => x(data)
                return {
                  catch: (y) => {onFail = y}
                }
              }
            }
          }
        }
      })

      store = mockStore({
        query: {
          date_received_min: new Date(2013, 1, 3),
          from: 0,
          has_narrative: true,
          queryString: '?foo',
          searchText: '',
          size: 10,
        },
        results: {
          activeCall: ''
        }
      })
    })

    it('calls the API', () => {
      store.dispatch(sut.getComplaints())
      expect(global.fetch).toHaveBeenCalled()
    })

    it('discards duplicate API calls', () => {
      const s = store.getState()
      s.results.activeCall = '@@API' + s.query.queryString
      store = mockStore(s)

      store.dispatch(sut.getComplaints())
      expect(global.fetch).not.toHaveBeenCalled()
    })

    describe('when the API call is finished', () => {
      it('sends a simple action when data is received', () => {
        store.dispatch(sut.getComplaints())
        const expectedActions = [
          { type: sut.COMPLAINTS_API_CALLED, url: expect.any(String) },
          { type: sut.COMPLAINTS_RECEIVED, data: ['123']}
        ]
        onSuccess(['123'])
        expect(store.getActions()).toEqual(expectedActions)
      })

      it('sends a different simple action when an error occurs', () => {
        store.dispatch(sut.getComplaints())
        const expectedActions = [
          { type: sut.COMPLAINTS_API_CALLED, url: expect.any(String) },
          { type: sut.COMPLAINTS_FAILED, error: 'oops' }
        ]
        onFail('oops')
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })

  describe('getComplaintDetail', () => {
    let onSuccess, onFail

    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation((url) => {
        expect(url).toContain('@@API123')

        return {
          then: (x) => {
            x({ json: () => ({})})
            return {
              then: (x) => {
                onSuccess = (data) => x(data)
                return {
                  catch: (y) => {onFail = y}
                }
              }
            }
          }
        }
      })
    })

    it('calls the API', () => {
      const store = mockStore({})
      store.dispatch(sut.getComplaintDetail('123'))
      expect(global.fetch).toHaveBeenCalled()
    })

    describe('when the API call is finished', () => {
      let store
      beforeEach(() => {
        store = mockStore({})
        store.dispatch(sut.getComplaintDetail('123'))
      })

      it('sends a simple action when data is received', () => {
        const expectedActions = [
          { type: sut.COMPLAINTS_API_CALLED, url: '@@API123' },
          { type: sut.COMPLAINT_DETAIL_RECEIVED, data: { foo: 'bar' }}
        ]
        onSuccess({ foo: 'bar' })
        expect(store.getActions()).toEqual(expectedActions)
      })

      it('sends a different simple action when an error occurs', () => {
        const expectedActions = [
          { type: sut.COMPLAINTS_API_CALLED, url: '@@API123' },
          { type: sut.COMPLAINT_DETAIL_FAILED, error: 'oops' }
        ]
        onFail('oops')
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })
})
