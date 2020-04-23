import configureMockStore from 'redux-mock-store'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { MapPanel, mapDispatchToProps } from '../components/map/MapPanel'
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
      enablePer1000: false,
      from: 0,
      mapWarningEnabled: true,
      product: [
        { name: 'foo' }
      ],
      size: 10,
      tab: MODE_MAP
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
        <MapPanel showWarning={true}/>
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

  describe('mapDispatchToProps', ()=>{
    it('hooks into dismissWarning', ()=>{
      const dispatch = jest.fn()
      mapDispatchToProps(dispatch).onDismissWarning();
      expect(dispatch.mock.calls.length).toEqual(1);
    })

  })
} )
