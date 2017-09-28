import { SearchPanel } from '../SearchPanel'
import React from 'react'
import renderer from 'react-test-renderer'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'

function setupSnapshot(initialStore={}) {
  const results = Object.assign({}, initialStore)

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    query: {},
    results
  })

  return renderer.create(
    <Provider store={ store } >
      <IntlProvider locale="en">
        <SearchPanel lastUpdated={ results.lastUpdated } />
      </IntlProvider>
    </Provider>
  )
}

describe('component:SearchPanel', () => {
  it('renders without crashing', () => {
    const target = setupSnapshot()
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays last updated date when present', () => {
    const target = setupSnapshot({ lastUpdated: new Date( '2016-02-01T05:00:00.000Z' ) })
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  })
})
