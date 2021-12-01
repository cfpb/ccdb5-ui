import configureMockStore from 'redux-mock-store'
import ReduxChartToggles, {
  mapDispatchToProps, mapStateToProps, ChartToggles
} from '../RefineBar/ChartToggles'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import thunk from 'redux-thunk'
import * as utils from '../../utils'

function setupEnzyme( cb, chartType ) {
  return shallow( <ChartToggles toggleChartType={ cb }
                                chartType={ chartType }/> )
}
function setupSnapshot() {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {
    trends: {
      chartType: 'line'
    }
  } )

  return renderer.create(
    <Provider store={ store }>
      <ReduxChartToggles />
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
    } )

    it( 'Line - changeChartType is called the button is clicked', () => {
      target = setupEnzyme( cb, 'foo' )
      const prev = target.find( '.chart-toggles .line' )
      prev.simulate( 'click' )
      expect( cb ).toHaveBeenCalledWith( 'line' )
    } )

    it( 'Area - changeChartType is called the button is clicked', () => {
      target = setupEnzyme( cb, 'foo' )
      const prev = target.find( '.chart-toggles .area' )
      prev.simulate( 'click' )
      expect( cb ).toHaveBeenCalledWith( 'area' )
    } )

    it( 'changeChartType is NOT called when chartType is the same', () => {
      target = setupEnzyme( cb, 'line' )
      const prev = target.find( '.chart-toggles .line' )
      prev.simulate( 'click' )
      expect( cb ).not.toHaveBeenCalled()
    } )
  } )


  describe( 'mapDispatchToProps', () => {
    it( 'provides a way to call changeChartType', () => {
      const dispatch = jest.fn()
      const gaSpy = jest.spyOn( utils, 'sendAnalyticsEvent' )
      mapDispatchToProps( dispatch ).toggleChartType( 'my-chart' )
      expect( dispatch.mock.calls ).toEqual( [
        [ {
          chartType: 'my-chart',
          requery: 'REQUERY_NEVER',
          type: 'CHART_TYPE_CHANGED'
        } ]
      ] )
      expect( gaSpy ).toHaveBeenCalledWith( 'Button', 'Trends:my-chart' )
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
