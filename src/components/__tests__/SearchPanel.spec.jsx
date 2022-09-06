import ReduxSearchPanel, { SearchPanel } from '../Search/SearchPanel'
import React from 'react'
import renderer from 'react-test-renderer'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'

function setupSnapshot() {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore( {
    aggs: {
      lastIndexed: new Date( '2016-02-01T05:00:00.000Z' )
    },
    query: {
      date_received_max: '2020-04-05T12:00:00.000Z',
      date_received_min: '2011-12-31T12:00:00.000Z',
      searchField: 'all',
      searchText: 'something searching',
    }
  })

  return renderer.create(
    <Provider store={ store } >
      <IntlProvider locale="en">
        <ReduxSearchPanel />
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
})
