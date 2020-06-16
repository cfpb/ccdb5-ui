import ReduxExternalTooltip, {
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

function setupSnapshot( query, tooltip ) {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )

  const store = mockStore( {
    query,
    trends: {
      tooltip
    }
  } )

  return renderer.create(
    <Provider store={ store }>
      <ReduxExternalTooltip />
    </Provider>
  )
}

describe( 'initial state', () => {
  let query, tooltip
  beforeEach(()=>{
    query = {
      focus: '',
      lens: ''
    }
    tooltip = {
      title: 'Ext tip title',
      total: 2900,
      values: [
        { colorIndex: 1, name: 'foo', value: 1000 },
        { colorIndex: 2, name: 'bar', value: 1000 },
        { colorIndex: 3, name: 'Other', value: 900 },
        { colorIndex: 4, name: "Eat at Joe's", value: 1000 }
      ]
    }
  })
  it( 'renders without crashing', () => {
    const target = setupSnapshot( query, tooltip )
    const tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )

  it( 'renders nothing without crashing', () => {
    const target = setupSnapshot( query, false )
    const tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )

  it( 'renders Company typehead without crashing', () => {
    query.lens = 'Company'
    const target = setupSnapshot( query, tooltip )
    const tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )
} )

describe( 'buttons', () => {
  let cb = null
  let cbFocus
  let target = null

  beforeEach( () => {
    cb = jest.fn()
    cbFocus = jest.fn()
    target = shallow( <ExternalTooltip remove={ cb }
                                       add={ cbFocus }
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

  it( 'triggers Focus when the link is clicked', () => {
    const prev = target.find( '#focus-bar' )
    prev.simulate( 'click' )
    expect( cbFocus ).toHaveBeenCalledWith( 'bar' )
  } )
} )

describe( 'mapDispatchToProps', () => {
  it( 'provides a way to call add', () => {
    const dispatch = jest.fn()
    mapDispatchToProps( dispatch ).add( 'Baz' )
    expect( dispatch.mock.calls ).toEqual( [ [ {
      focus: 'Baz',
      requery: 'REQUERY_ALWAYS',
      type: 'FOCUS_CHANGED'
    } ] ] )
  } )

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
  let state
  beforeEach(()=>{
    state = {
      query: {
        focus: '',
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
  })
  it( 'maps state and props', () => {
    let actual = mapStateToProps( state )
    expect( actual ).toEqual( {
      focus: '',
      lens: 'Overview',
      showCompanyTypeahead: false,
      tooltip: {
        title: 'Date: A tooltip',
        total: 100,
        values: []
      }
    } )
  } )

  it( 'maps state and props - focus', () => {
    state.query.focus = 'something else'
    let actual = mapStateToProps( state )
    expect( actual.focus ).toEqual( 'focus' )
  } )
} )
