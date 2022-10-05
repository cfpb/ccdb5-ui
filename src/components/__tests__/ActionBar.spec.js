import React from 'react';
import { ActionBar, mapDispatchToProps } from '../ActionBar';
import { shallow } from 'enzyme';
import * as utils from '../../utils';

describe('export button', () => {
  it('clicks the button', () => {
    const props = {
      hits: 100,
      onExportResults: jest.fn(),
      tab: 'Pepsi-free',
      total: 100,
    };
    const target = shallow(<ActionBar {...props} />);
    const button = target.find('.export-btn');
    button.simulate('click');
    expect(props.onExportResults).toHaveBeenCalledWith('Pepsi-free');
  });
});

describe('print-friendly view', () => {
  const { location } = window;
  let gaSpy;
  beforeEach(() => {
    gaSpy = jest.spyOn(utils, 'sendAnalyticsEvent');
    delete window.location;
    // provide an empty implementation for window.assign
    window.location = {
      assign: jest.fn(),
      href: 'http://ccdb-website.gov',
    };
  });

  afterEach(() => {
    window.location = location;
  });
  it('clicks the button', () => {
    const props = {
      hits: 100,
      onExportResults: jest.fn(),
      tab: 'Pepsi',
      total: 100,
    };
    const target = shallow(<ActionBar {...props} />);
    const button = target.find('.print-preview');
    button.simulate('click');
    expect(window.location.assign).toHaveBeenCalledWith(
      'http://ccdb-website.gov&isPrintMode=true&' + 'isFromExternal=true'
    );
    expect(gaSpy).toHaveBeenCalledWith('Print', 'tab:Pepsi');
  });
});

describe('mapDispatchToProps', () => {
  it('hooks into onExportResults', () => {
    const dispatch = jest.fn();
    const gaSpy = jest.spyOn(utils, 'sendAnalyticsEvent');
    mapDispatchToProps(dispatch).onExportResults('foo-bar');
    expect(dispatch.mock.calls.length).toEqual(1);
    expect(gaSpy).toHaveBeenCalledWith(
      'Export',
      'foo-bar:User Opens Export Modal'
    );
  });
});
