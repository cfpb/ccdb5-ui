import TileChartMap from '../TileChartMap'
import configureMockStore from 'redux-mock-store'
import { mount } from 'enzyme'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import thunk from 'redux-thunk'

function setupSnapshot() {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {
    map: {}
  } );

  return renderer.create(
    <Provider store={ store }>
      <TileChartMap/>
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

describe('componentDidUpdate', () => {
  it('trigger a new update when data changes', () => {
    const props = {
      page: 2,
      total: 10
    }

    const target = mount(<TileChartMap {...props} />);
    target.setProps({ data: 'bar' })
    const sv = target.state('data')
    expect(sv).toEqual('bar')
  })
})
