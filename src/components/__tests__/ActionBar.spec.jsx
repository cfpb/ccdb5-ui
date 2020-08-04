import React from 'react'
import { IntlProvider } from 'react-intl'
import ReduxActionBar, { ActionBar, mapDispatchToProps } from '../ActionBar'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import * as utils from '../../utils'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

describe('initial state', () => {
  it('renders without crashing', () => {
    const middlewares = [thunk]
    const mockStore = configureMockStore(middlewares)
    const store = mockStore({
      aggs: {
        doc_count: 100,
        total: 10
      },
      query: { tab: 'Map' },
      view: {
        printMode: false
      }
    } )
    const target = renderer.create(
      <Provider store={ store }>
        <IntlProvider locale="en">
          <ReduxActionBar/>
        </IntlProvider>
      </Provider>
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe( 'export button', () => {
    it( 'clicks the button', () => {
      const props = {
        hits: 100,
        onExportResults: jest.fn(),
        tab: 'Pepsi-free',
        total: 100
      }
      const target = shallow( <ActionBar { ...props } /> )
      const button = target.find( '.export-btn' )
      button.simulate( 'click' )
      expect( props.onExportResults ).toHaveBeenCalledWith( 'Pepsi-free' )
    } )
  } )

  describe('print-friendly view', ()=>{
    const { location } = window
    let gaSpy
    beforeEach(()=>{
      gaSpy = spyOn( utils, 'sendAnalyticsEvent' )
      delete window.location
      // provide an empty implementation for window.assign
      window.location = {
        assign: jest.fn(),
        href: 'http://ccdb-website.gov'
      }
    })

    afterEach(()=>{
      window.location = location
    })
    it('clicks the button',()=>{
      const props = {
        hits: 100,
        onExportResults: jest.fn(),
        tab: 'Pepsi',
        total: 100
      }
      const target = shallow(<ActionBar {...props} />)
      const button = target.find('.print-preview')
      button.simulate('click')
      expect( window.location.assign )
        .toHaveBeenCalledWith( 'http://ccdb-website.gov&printMode=true&' +
          'fromExternal=true' )
      expect( gaSpy ).toHaveBeenCalledWith( 'Print', 'tab:Pepsi' )
    } )
  })

  describe( 'mapDispatchToProps', () => {
    it( 'hooks into onExportResults', () => {
      const dispatch = jest.fn()
      const gaSpy = spyOn( utils, 'sendAnalyticsEvent' )
      mapDispatchToProps( dispatch ).onExportResults( 'foo-bar' )
      expect( dispatch.mock.calls.length ).toEqual( 1 )
      expect( gaSpy )
        .toHaveBeenCalledWith( 'Export', 'foo-bar:User Opens Export Modal' )
    } )
  } )
});

