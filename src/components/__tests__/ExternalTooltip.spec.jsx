import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { ExternalTooltip, mapStateToProps } from '../Trends/ExternalTooltip'
import renderer from 'react-test-renderer'

function setupSnapshot( tooltip ) {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {
    trends: {}
  } )

  return renderer.create(
    <Provider store={ store }>
      <ExternalTooltip tooltip={ tooltip }/>
    </Provider>
  )
}

describe( 'initial state', () => {
  it( 'renders without crashing', () => {
    const tooltip = {
      title: 'Ext tip title',
      total: 2000,
      values: [
        { colorIndex: 1, name: 'foo', value: 1000 },
        { colorIndex: 2, name: 'foo', value: 1000 }
      ]
    }
    const target = setupSnapshot( tooltip )
    const tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )

  it( 'renders nothing without crashing', () => {
    const target = setupSnapshot()
    const tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )
} )


describe( 'mapStateToProps', () => {
  it( 'maps state and props', () => {
    const state = {
      trends: {
        tooltip: {
          title: 'Date: A tooltip',
          total: 100,
          values: []
        }
      }
    }
    let actual = mapStateToProps( state )
    expect( actual ).toEqual( {
      tooltip: {
        title: 'Date: A tooltip',
        total: 100,
        values: []
      }
    } )
  } )
} )
