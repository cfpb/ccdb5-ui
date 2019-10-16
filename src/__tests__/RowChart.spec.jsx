import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import React from 'react'
import RowChart from '../RowChart'
import renderer from 'react-test-renderer'
import thunk from 'redux-thunk'

function setupSnapshot() {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {
    map: {},
    query: {},
    results: {
      total: 0
    }
  } );

  return renderer.create(
    <Provider store={ store }>
      <RowChart aggtype="foo" />
    </Provider>
  )
}

describe( 'initial state', () => {
  it( 'renders without crashing', () => {
    const target = setupSnapshot()
    let tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )
} )
