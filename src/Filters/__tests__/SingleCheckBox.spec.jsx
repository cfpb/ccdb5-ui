import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import SingleCheckbox from '../SingleCheckbox'
import renderer from 'react-test-renderer'
import thunk from 'redux-thunk'

function setupSnapshot() {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    query: {},
    aggs: {}
  })

  return renderer.create(
    <Provider store={store}>
      <SingleCheckbox />
    </Provider>
  )
}

describe('initial state', () => {
  it('renders without crashing', () => {
    const target = setupSnapshot()
    const tree = target.toJSON()
    expect(tree).toMatchSnapshot()
  });
});

