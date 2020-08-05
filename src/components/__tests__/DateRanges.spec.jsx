import configureMockStore from 'redux-mock-store'
import ReduxDateRanges, {
  mapDispatchToProps, mapStateToProps, DateRanges
} from '../RefineBar/DateRanges'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import * as utils from '../../utils'
import * as types from '../../constants'
import { shallow } from 'enzyme'
import thunk from 'redux-thunk'


function setupEnzyme(cb, dateRange){
  return shallow( <DateRanges toggleDateRange={ cb }
                              dateRange={dateRange}
                              tab={'foo'}/> )
}
function setupSnapshot() {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {
    query: {
      dateRange: '3y',
      tab: types.MODE_MAP
    }
  } )

  return renderer.create(
    <Provider store={ store }>
      <ReduxDateRanges />
    </Provider>
  )
}

describe( 'component: DateRanges', () => {
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
    } )

    it( 'toggleDateRange is called the button is clicked', () => {
      target = setupEnzyme( cb, 'All' )
      const prev = target.find( '.date-ranges .range-3m' )
      prev.simulate( 'click' )
      expect( cb ).toHaveBeenCalledWith( '3m', 'foo' )
    } )

    it( 'toggleDateRange is NOT called when the value is same', () => {
      target = setupEnzyme( cb, '3m' )
      const prev = target.find( '.date-ranges .range-3m' )
      prev.simulate( 'click' )
      expect( cb ).not.toHaveBeenCalled()
    } )
  })


  describe('mapDispatchToProps', () => {
    let gaSpy
    beforeEach( () => {
      gaSpy = jest.spyOn( utils, 'sendAnalyticsEvent' )
    } )
    it( 'provides a way to call toggleDateRange', () => {
      const dispatch = jest.fn()
      mapDispatchToProps( dispatch ).toggleDateRange( 'Foo', 'Bar' )
      expect( dispatch.mock.calls.length ).toEqual( 1 )
      expect( gaSpy ).toHaveBeenCalledWith( 'Button', 'Bar:Foo' )
    } )
  })

  describe( 'mapStateToProps', () => {
    it( 'maps state and props', () => {
      const state = {
        query: {
          dateRange: 'foo'
        }
      }
      let actual = mapStateToProps( state )
      expect( actual ).toEqual( { dateRange: 'foo' } )
    } )
  } )


} )
