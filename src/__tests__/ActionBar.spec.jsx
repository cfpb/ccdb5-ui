import React from 'react';
import { IntlProvider } from 'react-intl';
import { ActionBar, mapDispatchToProps } from '../ActionBar';
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
    let jsdomOpen
    beforeEach(()=>{
      jsdomOpen = window.open
      // remember the jsdom alert
      window.open = () => {}
      // provide an empty implementation for window.open
    })

    afterEach(()=>{
      window.open = jsdomOpen
    })
    it('clicks the button',()=>{
      const props = {
        hits: 100,
        onExportResults: jest.fn(),
        total: 100
      }
      const target = shallow(<ActionBar {...props} />)
      const btnSpy = jest.spyOn(window, 'open')
      const button = target.find('.print-preview')
      button.simulate('click')
      expect( btnSpy )
        .toHaveBeenCalledWith( 'http://localhost/&printMode=true', '_blank' )
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

