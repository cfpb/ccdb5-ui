import React from 'react';
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import FilterPanel from '../FilterPanel';
import renderer from 'react-test-renderer';

function setupSnapshot() {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    query: {},
    aggs: {}
  })

  return renderer.create(
    <Provider store={store}>
      <FilterPanel />
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

