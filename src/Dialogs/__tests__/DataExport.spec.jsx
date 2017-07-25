import React from 'react'
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import ReduxDataExport from '../DataExport'

function setupSnapshot() {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    results: {
      doc_count: 9999,
      total: 1001
    },
  })

  return renderer.create(
    <Provider store={store}>
      <IntlProvider locale="en">
        <ReduxDataExport />
      </IntlProvider>
    </Provider>
  )
}

describe('component::DataExport', () => {
  describe('initial state', () => {
    it('renders without crashing', () => {
      const target = setupSnapshot()
      const tree = target.toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
