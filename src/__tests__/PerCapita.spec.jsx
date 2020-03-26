import configureMockStore from 'redux-mock-store'
import {
  mapDispatchToProps, mapStateToProps, PerCapita
} from '../PerCapita'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import thunk from 'redux-thunk'

function setupSnapshot() {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {
    map: {}
  } )

  return renderer.create(
    <Provider store={ store }>
      <PerCapita />
    </Provider>
  )
}

describe( 'component: PerCapita', () => {
  describe( 'initial state', () => {
    it( 'renders without crashing', () => {
      const target = setupSnapshot()
      let tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )
  } )

  describe('mapDispatchToProps', () => {
    it('hooks into onDataNormalization', () => {
      const dispatch = jest.fn();
      const ev = {
        target: {
          value: 123
        }
      }
      mapDispatchToProps(dispatch).onDataNormalization( ev );
      expect(dispatch.mock.calls.length).toEqual(1);
    })
  })

  describe( 'mapStateToProps', () => {
    it( 'maps state and props', () => {
      const state = {
        map: {
          dataNormalization: 'foo'
        },
        query: {}
      }
      let actual = mapStateToProps( state )
      expect( actual ).toEqual( {
        dataNormalization: 'foo',
        enablePer1000: true
      } )
    } )
  } )


} )
