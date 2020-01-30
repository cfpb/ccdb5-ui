import configureMockStore from 'redux-mock-store'
import {
  mapDispatchToProps, mapStateToProps, MapToolbar
} from '../MapToolbar'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import thunk from 'redux-thunk'

function setupEnzyme() {
  const props = {
    removeState: jest.fn(),
    selectedState: { abbr: 'TX', name: 'Texas' },
    showComplaints: jest.fn()
  }

  const target = shallow( <MapToolbar { ...props } /> )

  return {
    props,
    target
  }
}


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
    name: 'Texas'
  }
  return renderer.create(
    <Provider store={ store }>
      <MapToolbar selectedState={ selectedState }/>
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


  describe( 'mapDispatchToProps', () => {
    beforeEach( () => {
      jest.clearAllMocks()
    } )
    it( 'provides a way to call removeState', () => {
      const dispatch = jest.fn()
      mapDispatchToProps( dispatch ).removeState()
      expect( dispatch.mock.calls.length ).toEqual( 1 )
    } )
    it( 'provides a way to call showComplaints', () => {
      const dispatch = jest.fn()
      mapDispatchToProps( dispatch ).showComplaints()
      expect( dispatch.mock.calls.length ).toEqual( 1 )
    } )
  } )

  describe( 'mapStateToProps', () => {
    it( 'maps state and props', () => {
      const state = {
        map: {
          selectedState: {
            abbr: 'fo',
            name: 'foo'
          }
        }
      }
      let actual = mapStateToProps( state )
      expect( actual ).toEqual( {
        selectedState: {
          abbr: 'fo',
          name: 'foo'
        }
      } )
    } )
  } )

  describe( 'click actions', () => {
    it( 'allows the user to remove state filter', () => {
      const { target, props } = setupEnzyme()
      const button = target.find( 'button.clear' )

      button.simulate( 'click' )
      expect( props.removeState ).toHaveBeenCalled()
    } )
    it( 'allows the user to view complaints by state ', () => {
      const { target, props } = setupEnzyme()
      const button = target.find( 'button.list' )

      button.simulate( 'click' )
      expect( props.showComplaints ).toHaveBeenCalled()
    } )
  } )
} )
