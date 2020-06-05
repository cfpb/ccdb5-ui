import {
  ExternalTooltip,
  mapDispatchToProps,
  mapStateToProps
} from '../Trends/ExternalTooltip'
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

function setupSnapshot( tooltip, showCompanyTypeahead ) {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {
    query: {
      queryString: 'foo'
    },
    trends: {}
  } )

  return renderer.create(
    <Provider store={ store }>
      <ExternalTooltip tooltip={ tooltip }
                       showCompanyTypeahead={ showCompanyTypeahead }/>
    </Provider>
  )
}

describe( 'initial state', () => {
  it( 'renders without crashing', () => {
    const tooltip = {
      title: 'Ext tip title',
      total: 2000,
      values: [
        { colorIndex: 1, name: 'foo', value: 1000 },
        { colorIndex: 2, name: 'foo', value: 1000 }
      ]
    }
    const target = setupSnapshot( tooltip, false )
    const tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )

  it( 'renders nothing without crashing', () => {
    const target = setupSnapshot( null, false )
    const tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )

  it( 'renders Company typehead without crashing', () => {
    const tooltip = {
      title: 'Ext tip title',
      total: 2000,
      values: [
        { colorIndex: 1, name: 'foo', value: 1000 },
        { colorIndex: 2, name: 'foo', value: 1000 }
      ]
    }
    const target = setupSnapshot( tooltip, true )
    const tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )
} )

describe( 'buttons', () => {
  let cb = null
  let target = null

  beforeEach( () => {
    cb = jest.fn()

    target = shallow( <ExternalTooltip remove={ cb }
                                       showCompanyTypeahead={ true }
                                       tooltip={ {
                                         title: 'foo title',
                                         total: 20,
                                         values: [
                                           {
                                             colorIndex: 1,
                                             value: 10,
                                             name: 'foo'
                                           },
                                           {
                                             colorIndex: 2,
                                             value: 10,
                                             name: 'bar'
                                           }
                                         ]
                                       } }/> )
  } )

  it( 'remove is called the button is clicked', () => {
    const prev = target.find( '.tooltip-ul .color__1 .close' )
    prev.simulate( 'click' )
    expect( cb ).toHaveBeenCalledWith( 'foo' )
  } )
} )

describe( 'mapDispatchToProps', () => {
  it( 'provides a way to call remove', () => {
    const dispatch = jest.fn()
    mapDispatchToProps( dispatch ).remove( 'Foo' )
    expect( dispatch.mock.calls ).toEqual( [ [ {
      filterName: 'company',
      filterValue: 'Foo',
      requery: 'REQUERY_ALWAYS',
      type: 'FILTER_REMOVED'
    } ] ] )
  } )
} )


describe( 'mapStateToProps', () => {
  it( 'maps state and props', () => {
    const state = {
      query: {
        lens: 'Overview'
      },
      trends: {
        tooltip: {
          title: 'Date: A tooltip',
          total: 100,
          values: []
        }
      }
    }
    let actual = mapStateToProps( state )
    expect( actual ).toEqual( {
      showCompanyTypeahead: false,
      tooltip: {
        title: 'Date: A tooltip',
        total: 100,
        values: []
      }
    } )
  } )
} )
