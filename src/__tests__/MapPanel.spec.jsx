import configureMockStore from 'redux-mock-store'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import MapPanel from '../MapPanel'
import { MODE_MAP } from '../constants'
import React from 'react'
import renderer from 'react-test-renderer'
import thunk from 'redux-thunk'

function setupSnapshot( printMode ) {
  const items = [
    { key: 'CA', doc_count: 62519 },
    { key: 'FL', doc_count: 47358 }
  ]

  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {
    aggs: {
      doc_count: 100,
      total: items.length
    },
    map: {
      product: [],
      state: []
    },
    query: {
      from: 0,
      size: 10,
      tab: MODE_MAP,
      product: [
        { name: 'foo' }
      ]
    },
    results: {
      items
    },
    view: {
      printMode
    }
} )

  return renderer.create(
    <Provider store={ store }>
      <IntlProvider locale="en">
        <MapPanel />
      </IntlProvider>
    </Provider>
  )
}

describe( 'component:MapPanel', () => {
  it( 'renders without crashing', () => {
    const printMode = false
    const target = setupSnapshot( printMode )
    const tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )

  it( 'renders Print without crashing', () => {
    const printMode = true
    const target = setupSnapshot( printMode )
    const tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )
} )
