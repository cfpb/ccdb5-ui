import configureMockStore from 'redux-mock-store'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { LensTabs, mapDispatchToProps } from '../Trends/LensTabs'
import { MODE_MAP } from '../../constants'
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
    query: {
      lens: 'Foo',
      subLens: 'issue'
    }
  } )

  return renderer.create(
    <Provider store={ store }>
      <IntlProvider locale="en">
        <LensTabs />
      </IntlProvider>
    </Provider>
  )
}

describe( 'component:LensTabs', () => {
  it( 'renders without crashing', () => {
    const target = setupSnapshot()
    const tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )

  describe('mapDispatchToProps', ()=>{
    it('hooks into changeDataSubLens', ()=>{
      const dispatch = jest.fn()
      mapDispatchToProps(dispatch).onTab();
      expect(dispatch.mock.calls.length).toEqual(1);
    })

  })
} )
