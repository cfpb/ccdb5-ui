import configureMockStore from 'redux-mock-store'
import {
  mapDispatchToProps, mapStateToProps, DateIntervals
} from '../DateIntervals'
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

  describe('buttons', () => {
    let cb = null
    let target = null

    beforeEach( () => {
      cb = jest.fn()

      target = shallow( <DateIntervals toggleDateInterval={ cb }/> )
    } )

    it( 'toggleDateInterval is called the button is clicked', () => {
      const prev = target.find( '.date-intervals .interval-3m' )
      prev.simulate( 'click' )
      expect( cb ).toHaveBeenCalledWith('3m')
    } )
  })


  describe('mapDispatchToProps', () => {
    it('provides a way to call toggleDateInterval', () => {
      const dispatch = jest.fn()
      mapDispatchToProps(dispatch).toggleDateInterval()
      expect(dispatch.mock.calls.length).toEqual(1)
    })
  })

  describe( 'mapStateToProps', () => {
    it( 'maps state and props', () => {
      const state = {
        query: {
          dateInterval: 'foo'
        }
      }
      let actual = mapStateToProps( state )
      expect( actual ).toEqual( { dateInterval: 'foo' } )
    } )
  } )


} )
