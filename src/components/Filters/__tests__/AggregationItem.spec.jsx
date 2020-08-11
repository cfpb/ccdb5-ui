import ReduxAggregationItem, {
  AggregationItem, mapDispatchToProps,
  mapStateToProps
} from '../AggregationItem'
import configureMockStore from 'redux-mock-store'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'
import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import { slugify } from '../../../utils'
import thunk from 'redux-thunk'


function setupEnzyme( rmCb, addCb, active ) {
  return shallow( <AggregationItem fieldName={ 'foo' }
                                   item={
                                     {
                                       key: 'hole',
                                       doc_count: 100,
                                       value: 'som'
                                     }
                                   }
                                   removeFilter={ rmCb }
                                   addFilter={ addCb }
                                   active={ active }
  /> )
}

function setupSnapshot() {
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  let active, onClick

  active = false
  onClick = jest.fn()

  const store = mockStore( {
    query: {
      fieldName: [ 213 ]
    }
  } )

  return renderer.create(
    <IntlProvider locale="en">
      <Provider store={ store }>
        <ReduxAggregationItem item={ { key: 'foo', doc_count: 1000 } }
                              fieldName={ 'fieldName' }
                              active={ active }
                              onClick={ onClick }/>
      </Provider>
    </IntlProvider>
  )
}

describe( 'component:AggregationItem', () => {
  let fieldName, item
  beforeEach( () => {
    item = { key: 'foo', doc_count: 1000 }
    fieldName = 'fieldName'
  } )
  it( 'renders without crashing', () => {
    const target = setupSnapshot()
    let tree = target.toJSON()
    expect( tree ).toMatchSnapshot()
  } )

  describe( '_onChange', () => {
    let rmCb, addCb, target
    beforeEach( () => {
      rmCb = jest.fn()
      addCb = jest.fn()
    } )

    it( 'ticks box - remove', () => {
      target = setupEnzyme( rmCb, addCb, true )
      const button = target.find( '#foo-hole' )
      button.simulate( 'change', { target: { checked: true } } )
      expect( addCb ).not.toHaveBeenCalled()
      expect( rmCb ).toHaveBeenCalled()
    } )

    it( 'ticks box - add', () => {
      target = setupEnzyme( rmCb, addCb, false )
      const button = target.find( '#foo-hole' )
      button.simulate( 'change', { target: { checked: false } } )
      expect( addCb ).toHaveBeenCalled()
      expect( rmCb ).not.toHaveBeenCalled()
    } )
  } )

  describe( 'mapDispatchToProps', () => {
    let dispatch, ownProps
    describe( 'addFilter', () => {
      it( 'appends subIssue filter when not all selected', () => {
        dispatch = jest.fn()
        ownProps = {
          fieldName: 'issue',
          item: {
            key: slugify( 'a', 'b' ),
            doc_count: 1000
          }
        }
        mapDispatchToProps( dispatch, ownProps ).addFilter( {
          aggs: [
            {
              key: 'a',
              doc_count: 1,
              'sub_issue.raw': {
                buckets: [
                  { key: 'b' },
                  { key: 'c' },
                  { key: 'd' }
                ]
              }
            }
          ],
          filters: [ 'f', 'g', 'h', slugify( 'a', 'd' ) ]
        } )
        expect( dispatch.mock.calls ).toEqual( [ [
          {
            filterName: 'issue',
            requery: 'REQUERY_ALWAYS',
            type: 'FILTER_REPLACED',
            values: [ 'f', 'g', 'h', slugify( 'a', 'd' ), slugify( 'a', 'b' ) ]
          }
        ] ] )
      } )

      it( 'replaces subItems with parent when children are selected', () => {
        dispatch = jest.fn()
        ownProps = {
          fieldName: 'issue',
          item: {
            key: slugify( 'a', 'b' ),
            doc_count: 1000
          }
        }
        mapDispatchToProps( dispatch, ownProps ).addFilter( {
          aggs: [
            {
              key: 'a',
              doc_count: 1,
              'sub_issue.raw': {
                buckets: [
                  { key: 'b' },
                  { key: 'c' },
                  { key: 'd' }
                ]
              }
            }
          ],
          filters: [ 'f', 'g', 'h', slugify( 'a', 'c' ), slugify( 'a', 'd' ) ]
        } )
        expect( dispatch.mock.calls ).toEqual( [ [
          {
            filterName: 'issue',
            requery: 'REQUERY_ALWAYS',
            type: 'FILTER_REPLACED',
            values: [ 'f', 'g', 'h', 'a' ]
          }
        ] ] )
      } )

      it( 'handles non product & issue filters', () => {
        dispatch = jest.fn()
        ownProps = { fieldName: fieldName, item: item }
        mapDispatchToProps( dispatch, ownProps ).addFilter( {
          aggs: {},
          fieldName: 'foo',
          filters: []
        } )
        expect( dispatch.mock.calls ).toEqual( [ [
          {
            filterName: 'fieldName',
            filterValue: {
              doc_count: 1000,
              key: 'foo'
            },
            requery: 'REQUERY_ALWAYS',
            type: 'FILTER_CHANGED'
          }
        ] ] )
      } )
    } )

    describe( 'removeFilter', () => {
      it( 'handles product/issue filters', () => {
        dispatch = jest.fn()
        ownProps = { fieldName: 'issue', item: item }
        mapDispatchToProps( dispatch, ownProps ).removeFilter( {
          aggs: {},
          fieldName: 'foo',
          filters: []
        } )
        expect( dispatch.mock.calls ).toEqual( [ [
          {
            filterName: 'issue',
            requery: 'REQUERY_ALWAYS',
            type: 'FILTER_REPLACED',
            values: []
          }
        ] ] )
      } )
      it( 'handles non product & issue filters', () => {
        dispatch = jest.fn()
        ownProps = { fieldName: fieldName, item: item }
        mapDispatchToProps( dispatch, ownProps ).removeFilter( {
          aggs: {},
          fieldName: 'foo',
          filters: []
        } )
        expect( dispatch.mock.calls ).toEqual( [ [
          {
            filterName: 'fieldName',
            filterValue: {
              doc_count: 1000,
              key: 'foo'
            },
            requery: 'REQUERY_ALWAYS',
            type: 'FILTER_CHANGED'
          }
        ] ] )
      } )
    } )
  } )

  describe( 'mapStateToProps', () => {
    let state, ownProps, propsReturn
    beforeEach( () => {
      state = {
        aggs: {
          issue: [ 1, 2, 3 ],
          product: [ 'foo', 'bar' ]
        },
        query: {
          issue: [ 1 ],
          timely: [ 'Yes' ]
        }
      }
    } )
    it( 'returns correct active value when no filter present', () => {
      ownProps = { fieldName: 'foobar', item: { key: 'Yes' } }
      propsReturn = mapStateToProps( state, ownProps )
      expect( propsReturn.active ).toEqual( false )
    } )

    it( 'returns correct active value fieldName key matches query', () => {
      ownProps = { fieldName: 'timely', item: { key: 'Yes' } }
      propsReturn = mapStateToProps( state, ownProps )
      expect( propsReturn.active ).toEqual( true )
    } )

    it( 'returns correct value when same fieldName passed with different value', () => {
      ownProps = { fieldName: 'timely', item: { key: 'No' } }
      propsReturn = mapStateToProps( state, ownProps )
      expect( propsReturn.active ).toEqual( false )
    } )

    it( 'maps aggs & filters with fieldName', () => {
      ownProps = { fieldName: 'issue', item: { key: 'No Money' } }
      propsReturn = mapStateToProps( state, ownProps )
      expect( propsReturn ).toEqual( {
        active: false,
        aggs: [ 1, 2, 3 ],
        filters: [ 1 ]
      } )
    } )
  } )
} )
