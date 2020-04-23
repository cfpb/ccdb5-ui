import React from 'react';
import { IntlProvider } from 'react-intl';
import { ActionBar, mapDispatchToProps } from '../components/ActionBar';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme'

describe('initial state', () => {
  it('renders without crashing', () => {
    const target = renderer.create(
      <IntlProvider locale="en">
        <ActionBar total="100" hits="10" />
      </IntlProvider>
    );

    let tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('print-friendly view', ()=>{
    const { location } = window
    beforeEach(()=>{
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
        total: 100
      }
      const target = shallow(<ActionBar {...props} />)
      const button = target.find('.print-preview')
      button.simulate('click')
      expect( window.location.assign )
        .toHaveBeenCalledWith( 'http://ccdb-website.gov&printMode=true&' +
          'fromExternal=true' )
    } )
  })

  describe('mapDispatchToProps', () => {
    it('hooks into onExportResults', () => {
      const dispatch = jest.fn();
      mapDispatchToProps(dispatch).onExportResults();
      expect(dispatch.mock.calls.length).toEqual(1);
    })
  })
});

