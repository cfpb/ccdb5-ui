import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { queryManager } from '../queryManager'
import { REQUERY_ALWAYS, REQUERY_HITS_ONLY } from '../../constants'

describe( 'redux middleware::queryManager', () => {
  describe('compound actions', () => {

    let store

    beforeEach( () => {
      const middlewares = [thunk, queryManager]
      const mockStore = configureMockStore(middlewares)
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
    } )

    it('does not query if an action has no metadata', () => {
      const action = {
        type: 'FakeAction'
      }
      const expectedActions = [ { type: 'FakeAction' } ]

      store.dispatch(action)
      expect(store.getActions()).toEqual(expectedActions)
    })

    describe( 'REQUERY_ALWAYS', () => {
      it( 'query if an action has metadata', () => {
        const action = {
          type: 'FakeAction',
          requery: REQUERY_ALWAYS
        }
        const expectedActions = [
          { type: 'FakeAction', requery: REQUERY_ALWAYS },
          { type: 'API_CALLED', url: "@@API?foo" }
        ]

        store.dispatch( action )
        expect( store.getActions() ).toEqual( expectedActions )
      } )
    } )

    describe( 'REQUERY_HITS_ONLY', () => {
      it( 'query if an action has metadata', () => {
        const action = {
          type: 'FakeAction',
          requery: REQUERY_HITS_ONLY
        }
        const expectedActions = [
          { type: 'FakeAction', requery: REQUERY_HITS_ONLY },
          { type: 'API_CALLED', url: "@@API?foo" }
        ]

        store.dispatch( action )
        expect( store.getActions() ).toEqual( expectedActions )
      } )
    } )
  })
})
