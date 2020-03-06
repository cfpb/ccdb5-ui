import {
  getComplaintCountText, mapStateToProps, PrintInfo
} from '../PrintInfo'
import { IntlProvider } from 'react-intl'
import React from 'react'
import renderer from 'react-test-renderer'

describe( 'component: PrintInfo', () => {
  describe( 'initial state', () => {
    it( 'renders without crashing', () => {
      const target = renderer.create(
        <IntlProvider locale="en">
          <PrintInfo
            complaintCountText={'Showing 100 complaints'}
            dates={'2013 - 2020'}
            searchText={'Got no money'}/>
        </IntlProvider>
      )
      let tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )
  } )

  describe( 'mapStateToProps', () => {
    it( 'maps state and props', () => {
      const state = {
        aggs: {
          doc_count: 40,
          total: 1000
        },
        query: {
          date_received_max: '2020-03-05T05:00:00.000Z',
          date_received_min: '2017-03-05T05:00:00.000Z',
          searchText: 'foobar'
        }
      }
      let actual = mapStateToProps( state )
      expect( actual ).toEqual( {
        complaintCountText: 'Showing 1,000 out of 40 total complaints',
        dates: '3/5/2017 - 3/5/2020',
        searchText: 'foobar'
      } )
    } )
  } )

  describe( 'getComplaintCountText', ()=> {
    it( 'gets text when counts are filtered', () => {
      const aggs = {
        doc_count: 100,
        total: 100
      }
      const result = getComplaintCountText( aggs )
      expect( result ).toEqual( 'Showing 100 complaints' )
    })
  });
} )
