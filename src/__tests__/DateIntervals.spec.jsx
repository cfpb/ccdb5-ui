import configureMockStore from 'redux-mock-store'
import { mapStateToProps, DateIntervals } from '../DateIntervals'
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
      <DateIntervals />
    </Provider>
  )
}

describe( 'component: DateIntervals', () => {
  describe( 'initial state', () => {
    it( 'renders without crashing', () => {
      const target = setupSnapshot()
      let tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )
  } )

  describe( 'mapStateToProps', () => {
    it( 'maps state and props', () => {
      const state = {
        view: {
          dateInterval: 'foo'
        }
      }
      let actual = mapStateToProps( state )
      expect( actual ).toEqual( { dateInterval: 'foo' } )
    } )
  } )


} )
