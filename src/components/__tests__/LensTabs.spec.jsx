import configureMockStore from 'redux-mock-store'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import { LensTabs, mapDispatchToProps } from '../Trends/LensTabs'
import { MODE_MAP, REQUERY_ALWAYS } from '../../constants'
import React from 'react'
import renderer from 'react-test-renderer'
import thunk from 'redux-thunk'

function setupSnapshot( printMode ) {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {} )

  return renderer.create(
    <Provider store={ store }>
      <IntlProvider locale="en">
        <LensTabs lens={ 'Product' }/>
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

  describe( 'mapDispatchToProps', () => {
    it( 'hooks into changeDataSubLens', () => {
      const dispatch = jest.fn()
      mapDispatchToProps( dispatch ).onTab( 'What' )
      expect( dispatch.mock.calls ).toEqual( [
        [ {
          requery: REQUERY_ALWAYS,
          subLens: 'what',
          type: 'DATA_SUBLENS_CHANGED'
        } ]
      ] )
    } )
  })
} )
