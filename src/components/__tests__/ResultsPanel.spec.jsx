import { mapDispatchToProps, ResultsPanel } from '../ResultsPanel'
import React from 'react';
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { IntlProvider } from 'react-intl';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme'

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

function setupSnapshot(items=[], initialStore={}, tab = 'List', printMode) {
  const results = Object.assign({
    error: '',
    hasDataIssue: false,
    isDataStale: false,
    items
  }, initialStore)

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    aggs: {
      doc_count: 100,
      total: items.length
    },
    map: {
      results: {
        issue: [],
        product: [],
        state: []
      }
    },
    results,
    query: {
      tab: tab
    },
    trends: {
      results: {}
    },
    view: {
      printMode
    }
  });

  return renderer.create(
    <Provider store={ store } >
      <IntlProvider locale="en">
        <ResultsPanel tab={tab} printMode={printMode}/>
      </IntlProvider>
    </Provider>
  )
}

describe('component:Results', () => {
  let target
  let actionMock = jest.fn()
  it('renders map panel without crashing', () => {
    const target = setupSnapshot( fixture, null, 'Map' );
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders list panel without crashing', () => {
    const target = setupSnapshot( fixture, null, 'List' );
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders Map print mode without crashing', () => {
    const target = setupSnapshot( fixture, null, 'Map', true );
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders List print mode without crashing', () => {
    const target = setupSnapshot( fixture, null, 'List', true );
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe( 'event listeners', () => {
    beforeEach( () => {
      window.addEventListener = jest.fn();
      window.removeEventListener = jest.fn();
    } );

    it( 'unregisters the same listener on unmount' , () => {
      const a = window.addEventListener
      const b = window.removeEventListener

      target = shallow( <ResultsPanel tab={'foo'} /> )
      expect(a.mock.calls.length).toBe(2)
      expect(a.mock.calls[0][0]).toBe('afterprint')
      expect(a.mock.calls[1][0]).toBe('beforeprint')

      target.unmount()
      expect(b.mock.calls.length).toBe(2)
      expect(b.mock.calls[0][0]).toBe('afterprint')
      expect(b.mock.calls[1][0]).toBe('beforeprint')

      expect(a.mock.calls[0][1]).toBe(b.mock.calls[0][1])
    } );
  } );

  describe('print mode', () => {
    afterEach( () => {
      jest.clearAllMocks()
    } )
    it( 'toggles print mode on', () => {
      target = shallow( <ResultsPanel togglePrintModeOn={actionMock} tab={'Foobar'}/> )
      const instance = target.instance()
      instance._togglePrintStylesOn()
      expect( actionMock ).toHaveBeenCalledTimes( 1 )
    } )

    it( 'toggles print mode off', () => {
      target = shallow( <ResultsPanel togglePrintModeOff={actionMock} tab={'Foobar'}/> )
      const instance = target.instance()
      instance._togglePrintStylesOff()
      expect( actionMock ).toHaveBeenCalledTimes( 1 )
    } )
  } );

  describe( 'mapDispatchToProps', () => {
    afterEach( () => {
      jest.clearAllMocks()
    } )
    it( 'provides a way to call togglePrintModeOn', () => {
      const dispatch = jest.fn()
      mapDispatchToProps( dispatch ).togglePrintModeOn()
      expect( dispatch.mock.calls.length ).toEqual( 1 )
    } )
    it( 'provides a way to call togglePrintModeOff', () => {
      const dispatch = jest.fn()
      mapDispatchToProps( dispatch ).togglePrintModeOff()
      expect( dispatch.mock.calls.length ).toEqual( 1 )
    } )
  } )
})
