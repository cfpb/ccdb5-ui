import configureMockStore from 'redux-mock-store'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import MapPanel from '../MapPanel'
import { MODE_MAP } from '../constants'
import React from 'react'
import renderer from 'react-test-renderer'
import thunk from 'redux-thunk'

function setupSnapshot( selectedState = false ) {
  const items = [
    { key: 'CA', doc_count: 62519 },
    { key: 'FL', doc_count: 47358 }
  ]

  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {
    map: {
      selectedState,
      state: []
    },
    query: {
      from: 0,
      size: 10,
      tab: MODE_MAP
    },
    results: {
      doc_count: 100,
      items,
      total: items.length
    }
} )

  const props = {
    selectedState: { abbr: 'FO', name: 'Foo Bar' }
  }

  return renderer.create(
    <Provider store={ store }>
      <IntlProvider locale="en">
        <MapPanel { ...props }/>
      </IntlProvider>
    </Provider>
  )
}

describe( 'component:MapPanel', () => {
  it( 'renders without crashing', () => {
    const target = setupSnapshot( { abbr: 'FO', name: 'Foo Bar' } )
    const tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )
} )
