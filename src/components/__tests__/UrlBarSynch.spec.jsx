import React from 'react'
import {
  UrlBarSynch,
  mapDispatchToProps,
  mapStateToProps
} from '../UrlBarSynch'
import * as types from '../../constants'

describe('component:UrlBarSynch', () =>{
  let target;
  let props;
  beforeEach(() => {
    props = {
      params: {
        searchText: '',
        from: 0,
        size: 10,
        date_received_min: new Date(2013, 1, 3),
        has_narrative: true
      },
      onUrlChanged: jest.fn()
    }

   target = new UrlBarSynch(props);
   target.history.push = jest.fn()
  });

  describe('componentWillReceiveProps', () => {
    it('pushes a change to the url bar when parameters change', () => {
      props.params.from = 99
      const expected = '?date_received_min=2013-02-03&from=99&has_narrative=true&size=10'

      target.UNSAFE_componentWillReceiveProps(props)

      expect(target.currentQS).toEqual(expected)
      expect(target.history.push).toHaveBeenCalledWith({ search: expected })
    })

    it('does not push history when parameters are the same', () => {
      target.currentQS = '?date_received_min=2013-02-03&from=0&has_narrative=true&size=10'
      target.UNSAFE_componentWillReceiveProps(props)
      expect(target.history.push).not.toHaveBeenCalled()
    })
  })

  describe('_onUrlChanged', () => {
    it('does nothing when the action is not "POP"', () => {
      target._onUrlChanged({search: '?foo=bar'}, 'PUSH');
      expect(props.onUrlChanged).not.toHaveBeenCalled();
    });

    it('calls the provided callback when the POP action happens', () => {
      target._onUrlChanged({search: '?foo=bar'}, 'POP');
      expect(target.currentQS).toEqual('?foo=bar')
      expect(props.onUrlChanged).toHaveBeenCalledWith({search: '?foo=bar'});
    });
  });

  describe('mapDispatchToProps', () => {
    it('hooks into announceUrlChanged', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).onUrlChanged({});
      expect(dispatch.mock.calls.length).toEqual(1);
    })
  })

  describe( 'mapStateToProps', () => {
    let actual, state
    beforeEach( () => {
      state = {
        map: {},
        query: {
          chartType: 'line',
          company_received_max: '2013',
          company_received_min: '2014',
          dataNormalization: types.GEO_NORM_NONE,
          dateInterval: 'Month',
          dateRange: '3y',
          date_received_max: '2019',
          date_received_min: '2012',
          focus: 'ford',
          has_narrative: true,
          lens: 'Product',
          page: 1,
          product: [ 'foo', 'bar' ],
          searchText: 'your term',
          searchField: 'all',
          sort: 'created_date_desc',
          size: 25,
          tab: types.MODE_LIST
        },
        trends: {
          chartType: 'line',
          focus: 'ford',
          lens: 'Product',
          subLens: 'sub_product'
        },
        view: {
          expandedRows: [ 'uno', 'dos' ]
        }
      }
    })

    it( 'handles LIST view', () => {
      actual = mapStateToProps( state )
      expect( actual.params ).toEqual( {
        company_received_max: '2013',
        company_received_min: '2014',
        date_received_max: '2019',
        date_received_min: '2012',
        has_narrative: true,
        page: 1,
        product: [ 'foo', 'bar' ],
        searchField: 'all',
        searchText: 'your term',
        size: 25,
        sort: 'created_date_desc',
        tab: 'List'
      } )
    } )
    it( 'handles MAP view', () => {
      state.query.tab = types.MODE_MAP
      actual = mapStateToProps( state )
      expect( actual.params ).toEqual( {
        company_received_max: '2013',
        company_received_min: '2014',
        dataNormalization: types.GEO_NORM_NONE,
        dateRange: '3y',
        date_received_max: '2019',
        date_received_min: '2012',
        expandedRows: [ 'uno', 'dos' ],
        has_narrative: true,
        product: [ 'foo', 'bar' ],
        searchField: 'all',
        searchText: 'your term',
        tab: 'Map'
      } )
    } )

    it( 'handles Trends view', () => {
      state.query.tab = types.MODE_TRENDS
      actual = mapStateToProps( state )
      expect( actual.params ).toEqual( {
        chartType: 'line',
        company_received_max: '2013',
        company_received_min: '2014',
        date_received_max: '2019',
        date_received_min: '2012',
        dateInterval: 'Month',
        dateRange: '3y',
        expandedRows: [ 'uno', 'dos' ],
        focus: 'ford',
        has_narrative: true,
        lens: 'Product',
        product: [ 'foo', 'bar' ],
        searchField: 'all',
        searchText: 'your term',
        subLens: 'sub_product',
        tab: 'Trends'
      } )
    } )
  } )
})
