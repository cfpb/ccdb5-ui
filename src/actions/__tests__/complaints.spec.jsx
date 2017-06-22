import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../complaints'
import * as types from '../../constants'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('getComplaints', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation((url) => {
        expect(url).toEqual('@@API');

        var p = new Promise((resolve, reject) => {
          resolve({
            json: function() { 
              return ['123']
            }
          });
        });

        return p;
    });
  });

  it('calls the API', () => {
    const expectedActions = [
      { type: types.COMPLAINTS_RECEIVED, items: ['123'] }
    ]
    const store = mockStore({ })

    return store.dispatch(actions.getComplaints()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})