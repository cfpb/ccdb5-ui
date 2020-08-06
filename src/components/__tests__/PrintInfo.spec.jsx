import ReduxPrintInfo, {
  getComplaintCountText, mapStateToProps
} from '../Print/PrintInfo'
import { IntlProvider } from 'react-intl'
import React from 'react'
import renderer from 'react-test-renderer'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'

function setupSnapshot(){
  const middlewares = [ thunk ]
  const mockStore = configureMockStore( middlewares )
  const store = mockStore( {
    aggs: {
      doc_count: 1000,
      total: 100
    },
    query: {
      date_received_min: '2017-03-05T05:00:00.000Z',
      date_received_max: '2020-03-05T05:00:00.000Z',
      searchText: 'Got no money'
    },
    view: {
      expandedRows: [],
      printMode: false,
      width: 1000
    }
  } )

  return renderer.create(
    <IntlProvider locale="en">
      <Provider store={ store }>
        <ReduxPrintInfo/>
      </Provider>
    </IntlProvider>
  )
}

describe( 'component: PrintInfo', () => {
  describe( 'initial state', () => {
    it( 'renders without crashing', () => {
      const target = setupSnapshot()
      let tree = target.toJSON()
      expect( tree ).toMatchSnapshot()
    } )
  } )

  describe( 'mapStateToProps', () => {
    it( 'maps state and props', () => {
      const state = {
        aggs: {
          doc_count: 4000,
          total: 1000
        },
        query: {
          date_received_max: '2020-03-05T05:00:00.000Z',
          date_received_min: '2017-03-05T05:00:00.000Z',
          searchText: 'foobar'
        }
      }
      let actual = mapStateToProps( state )
      expect(actual.complaintCountText).toBeTruthy()
      expect( actual ).toEqual(
        expect.objectContaining( {
          dates: '3/5/2017 - 3/5/2020',
          searchText: 'foobar'
        } )
      )
    } )
  } )

  describe( 'getComplaintCountText', ()=> {
    it( 'gets text when counts are filtered', () => {
      const aggs = {
        doc_count: 100,
        total: 100
      }
      const result = getComplaintCountText( aggs )
      expect( result ).toEqual( <div>Showing <span>100</span> complaints</div> )
    })
  });
} )
