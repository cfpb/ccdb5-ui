import configureMockStore from 'redux-mock-store'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import ReduxTrendDepthToggle, {
  TrendDepthToggle,
  mapDispatchToProps,
  mapStateToProps
} from '../Trends/TrendDepthToggle'
import React from 'react'
import renderer from 'react-test-renderer'
import { REQUERY_ALWAYS } from '../../constants'
import { shallow } from 'enzyme'
import thunk from 'redux-thunk'

function setupEnzyme( { cbIncrease, cbReset, diff } ) {
  return shallow( <TrendDepthToggle diff={ diff }
                                    increaseDepth={ cbIncrease }
                                    lens={ 'Product' }
                                    resetDepth={ cbReset }
                                    showToggle={ true }/> )
}

function setupSnapshot( { focus, lens, productAggs } ) {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {
    aggs: {
      product: productAggs
    },
    query: {
      focus,
      lens
    },
    trends: {
      results: {
        product: [ { name: 'a', visible: true }, { name: 'b', visible: true },
          { name: 'c', visible: true }, { name: 'd', visible: true },
          { name: 'e', visible: true }, { name: 'f', visible: true },
          { name: 'g', visible: true }, { name: 'h', visible: true }
        ]
      }
    }
  } )

  return renderer.create(
    <Provider store={ store }>
      <IntlProvider locale="en">
        <ReduxTrendDepthToggle/>
      </IntlProvider>
    </Provider>
  )
}

describe( 'component:TrendDepthToggle', () => {
  let params

  beforeEach( () => {
    params = {
      focus: '',
      lens: '',
      productAggs: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ]
    }
  } )

  it( 'does not render when Focus', () => {
    params.focus = 'A focus item'
    const target = setupSnapshot( params )
    const tree = target.toJSON()
    expect( tree ).toBeNull()
  } )

  it( 'does not render lens is not Product', () => {
    params.lens = 'Cannot See'
    const target = setupSnapshot( params )
    const tree = target.toJSON()
    expect( tree ).toBeNull()
  } )


  it( 'renders Product view more without crashing', () => {
    params.lens = 'Product'
    const target = setupSnapshot( params )
    const tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )

  it( 'renders Product view fewer without crashing', () => {
    params.lens = 'Product'
    params.productAggs = [ 1, 2, 3, 4, 5 ]
    const target = setupSnapshot( params )
    const tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )

  describe( 'buttons', () => {
    let cbIncrease = null
    let cbReset = null
    let target

    beforeEach( () => {
      cbIncrease = jest.fn()
      cbReset = jest.fn()

    } )

    it( 'increaseDepth is called when the increase button is clicked', () => {
      target = setupEnzyme( { cbIncrease, cbReset, diff: 1000 } )
      const prev = target.find( '#trend-depth-button' )
      prev.simulate( 'click' )
      expect( cbIncrease ).toHaveBeenCalledWith( 1000 )
    } )

    it( 'reset depth is called when the reset button is clicked', () => {
      target = setupEnzyme( { cbIncrease, cbReset, diff: 0 } )
      const prev = target.find( '#trend-depth-button' )
      prev.simulate( 'click' )
      expect( cbReset ).toHaveBeenCalled()
    } )
  } )

  describe( 'mapDispatchToProps', () => {
    it( 'hooks into changeDepth', () => {
      const dispatch = jest.fn()
      mapDispatchToProps( dispatch ).increaseDepth( 13 )
      expect( dispatch.mock.calls ).toEqual( [
        [ {
          requery: REQUERY_ALWAYS,
          depth: '18',
          type: 'DEPTH_CHANGED'
        } ]
      ] )
    } )

    it( 'hooks into resetDepth', () => {
      const dispatch = jest.fn()
      mapDispatchToProps( dispatch ).resetDepth()
      expect( dispatch.mock.calls ).toEqual( [
        [ {
          requery: REQUERY_ALWAYS,
          type: 'DEPTH_RESET'
        } ]
      ] )
    } )

  } )

  describe( 'mapStateToProps', () => {
    it( 'maps state and props', () => {
      const state = {
        aggs: {
          product: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ]
        },
        query: {
          focus: '',
          lens: 'Product'
        },
        trends: {
          results: {
            product: [ { name: 'a', visible: true }, {
              name: 'b',
              visible: true
            },
              { name: 'c', visible: true }, { name: 'd', visible: true },
              { name: 'e', visible: true }, { name: 'f', visible: true },
              { name: 'g', visible: true }, { name: 'h', visible: true }
            ]
          }
        }
      }
      let actual = mapStateToProps( state )
      expect( actual ).toEqual( {
        diff: 3,
        showToggle: true
      } )
    } )
  } )

} )
