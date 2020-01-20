import configureMockStore from 'redux-mock-store'
import {
  mapDispatchToProps, mapStateToProps, MapToolbar
} from '../MapToolbar'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import thunk from 'redux-thunk'

function setupSnapshot() {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {
    map: {
      selectedState: false
    }
  } )

  const selectedState = {
    abbr: 'TX',
    fullName: 'Texas'
  }
  return renderer.create(
    <Provider store={ store } >
      <MapToolbar selectedState={selectedState} />
    </Provider>
  )
}

describe( 'component: MapToolbar', () => {
  describe( 'initial state', () => {
    it( 'renders without crashing', () => {
      const target = setupSnapshot()
      let tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )
  } )


  describe('mapDispatchToProps', () => {
    it('provides a way to call showComplaints', () => {
      const dispatch = jest.fn()
      mapDispatchToProps(dispatch).showComplaints()
      expect(dispatch.mock.calls.length).toEqual(1)
    })
  })

  describe( 'mapStateToProps', () => {
    it( 'maps state and props', () => {
      const state = {
        map: {
          selectedState: {
            abbr: 'fo',
            fullName: 'foo'
          }
        }
      }
      let actual = mapStateToProps( state )
      expect( actual ).toEqual( {
        selectedState: {
          abbr: 'fo',
          fullName: 'foo'
        }
      } )
    } )
  } )
} )
