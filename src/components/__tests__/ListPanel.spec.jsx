import configureMockStore from 'redux-mock-store'
import ReduxListPanel, { ListPanel, mapDispatchToProps } from '../List/ListPanel';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux'
import React from 'react';
import thunk from 'redux-thunk'
import renderer from 'react-test-renderer';
import * as utils from '../../utils'

const fixture = [
  {
    company: 'foo',
    company_public_response: 'Closed',
    company_response: 'Closed',
    complaint_id: '1',
    complaint_what_happened: 'Lorem Ipsum',
    consumer_consent_provided: 'Yes',
    consumer_disputed: 'No',
    date_received: '2013-02-03T12:00:00Z',
    date_sent_to_company: '2013-01-01T12:00:00Z',
    issue: 'Foo',
    product: 'Bar',
    state: 'DC',
    sub_issue: 'Baz',
    sub_product: 'Qaz',
    submitted_via: 'email',
    timely: 'yes',
    zip_code: '200XX' 
  }
]

function setupSnapshot( items = [], initialStore = {}, queryStore = null, viewStore ) {
  const query = queryStore ? queryStore : {
    page: 1,
    size: 10,
    totalPages: 100
  }

  const aggs = Object.assign({
    hasDataIssue: false,
    isDataStale: false,
    doc_count: 100,
    total: items.length,
  }, initialStore)

  const view = Object.assign({
    width: 1000
  }, viewStore)

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore( {
    aggs,
    query,
    results: {
      error: '',
      items
    },
    view
  } )

  return renderer.create(
    <Provider store={ store } >
      <IntlProvider locale="en">
        <ReduxListPanel/>
      </IntlProvider>
    </Provider>
  )
}

describe('component:ListPanel', () => {
  it('renders without crashing', () => {
    const target = setupSnapshot(fixture)
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders mobile filters without crashing', () => {
    const target = setupSnapshot(fixture, null, null, {
      width: 700
    })
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays a message when there are no results', () => {
    const target = setupSnapshot([], null, {
      page: 1,
      size: 10,
      totalPages: 0
    } )
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  })

  it('displays a message when an error has occurred', () => {
    const target = setupSnapshot( [], { error: 'oops!' },
      {
        page: 1,
        size: 10,
        totalPages: 0
      } )
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  })

  it('displays a message when the data is stale', () => {
    const target = setupSnapshot(fixture, { isDataStale: true })
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  })

  it('displays a message when only the narratives are stale', () => {
    const target = setupSnapshot(fixture, { isNarrativeStale: true })
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  })

  it('only displays data message when both types are stale', () => {
    const target = setupSnapshot(fixture, 
      { isDataStale: true, isNarrativeStale: true })
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  })

  it('displays a message when the data has issues', () => {
    const target = setupSnapshot(fixture, { hasDataIssue: true })
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  })

  describe( 'mapDispatchToProps', () => {
    let dispatch, gaSpy
    beforeEach( () => {
      dispatch = jest.fn()
      gaSpy = jest.spyOn( utils, 'sendAnalyticsEvent' )
    } )

    afterEach( () => {
      jest.clearAllMocks()
    } )

    it( 'hooks into onSize', () => {
      mapDispatchToProps( dispatch ).onSize( { target: { value: '50' } } )
      expect( dispatch.mock.calls.length ).toEqual( 1 )
      expect( gaSpy ).toHaveBeenCalledWith( 'Dropdown', '50 results' )
    } )

    it( 'hooks into onSort', () => {
      mapDispatchToProps( dispatch ).onSort( { target: { value: 'created_date_desc' } } )
      expect( dispatch.mock.calls.length ).toEqual( 1 )
      expect( gaSpy ).toHaveBeenCalledWith( 'Dropdown', 'Newest to oldest' )
    } )
  } )
} )
