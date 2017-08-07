import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../complaints'
import * as types from '../../constants'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('action::complaints', () => {
  describe('getComplaints', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockImplementation((url) => {
          expect(url).toEqual('@@API?size=10')

          var p = new Promise((resolve, reject) => {
            resolve({
              json: function() { 
                return ['123']
              }
            })
          })

          return p
      })
    })

    it('calls the API', () => {
      const expectedActions = [
        { type: types.COMPLAINTS_RECEIVED, data: ['123'] }
      ]
      const store = mockStore({
        query: {
          searchText: '',
          from: 0,
          size: 10
        }
      })

      return store.dispatch(actions.getComplaints()).then(() => {
        // return of async actions
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
      store.dispatch(actions.getComplaintDetail('123'))
      expect(global.fetch).toHaveBeenCalled()
    })

    describe('when the API call is finished', () => {
      let store
      beforeEach(() => {
        store = mockStore({})
        store.dispatch(actions.getComplaintDetail('123'))
      })

      it('sends a simple action when data is received', () => {
        const expectedActions = [
          { type: types.COMPLAINT_DETAIL_RECEIVED, data: { foo: 'bar' }}
        ]
        onSuccess({ foo: 'bar' })
        expect(store.getActions()).toEqual(expectedActions)
      })

      it('sends a different simple action when an error occurs', () => {
        const expectedActions = [
          { type: types.COMPLAINT_DETAIL_FAILED, error: 'oops' }
        ]
        onFail('oops')
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })
})
