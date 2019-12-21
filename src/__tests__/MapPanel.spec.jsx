import configureMockStore from 'redux-mock-store'
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux'
import MapPanel from '../MapPanel';
import React from 'react'
import renderer from 'react-test-renderer';
import thunk from 'redux-thunk'

const fixture = [
  { key: 'CA', doc_count: 62519 },
  { key: 'FL', doc_count: 47358 }
]

function setupSnapshot(items=[], initialStore={}) {
  const results = Object.assign({
    doc_count: 100,
    error: '',
    hasDataIssue: false,
    isDataStale: false,
    items,
    total: items.length
  }, initialStore);

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    map: {
      state: []
    },
    query: {
      from: 0,
      size: 10,
      tab: 'Map'
    },
    results
  })

  return renderer.create(
    <Provider store={ store } >
      <IntlProvider locale="en">
        <MapPanel items={ items } />
      </IntlProvider>
    </Provider>
  )
}

describe('component:MapPanel', () => {
  it('renders without crashing', () => {
    const target = setupSnapshot(fixture)
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });
})
