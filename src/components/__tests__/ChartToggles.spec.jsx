import configureMockStore from 'redux-mock-store'
import {
  mapDispatchToProps, mapStateToProps, ChartToggles
} from '../RefineBar/ChartToggles'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import thunk from 'redux-thunk'
import { changeChartType } from '../../actions/trends'

function setupSnapshot() {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {} )

  return renderer.create(
    <Provider store={ store }>
      <ChartToggles chartType={'line'}/>
    </Provider>
  )
}

describe( 'component: ChartToggles', () => {
  describe( 'initial state', () => {
    it( 'renders without crashing', () => {
      const target = setupSnapshot()
      let tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )
  } )

  describe( 'buttons', () => {
    let cb = null
    let target = null

    beforeEach( () => {
      cb = jest.fn()

      target = shallow( <ChartToggles toggleChartType={ cb }/> )
    } )

    it( 'Line - changeChartType is called the button is clicked', () => {
      const prev = target.find( '.chart-toggles .line' )
      prev.simulate( 'click' )
      expect( cb ).toHaveBeenCalledWith( 'line' )
    } )

    it( 'Area - changeChartType is called the button is clicked', () => {
      const prev = target.find( '.chart-toggles .area' )
      prev.simulate( 'click' )
      expect( cb ).toHaveBeenCalledWith( 'area' )
    } )
  } )


  describe( 'mapDispatchToProps', () => {
    it( 'provides a way to call changeChartType', () => {
      const dispatch = jest.fn()
      mapDispatchToProps( dispatch ).toggleChartType()
      expect( dispatch.mock.calls.length ).toEqual( 1 )
    } )
  } )

  describe( 'mapStateToProps', () => {
    it( 'maps state and props', () => {
      const state = {
        trends: {
          chartType: 'foo'
        }
      }
      let actual = mapStateToProps( state )
      expect( actual ).toEqual( { chartType: 'foo' } )
    } )
  } )


} )
