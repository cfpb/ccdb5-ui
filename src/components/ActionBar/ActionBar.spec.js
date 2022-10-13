import React from 'react';
import { ActionBar } from './ActionBar';
import { defaultAggs } from '../../reducers/aggs/aggs';
import { defaultQuery } from '../../reducers/query/query';
import { merge } from '../../testUtils/functionHelpers';
import {
  testRender as render,
  fireEvent,
  screen,
} from '../../testUtils/test-utils';
import * as dataExportActions from '../../actions/dataExport';
import * as utils from '../../utils';

describe('ActionBar', () => {
  const renderComponent = (newAggsState, newQueryState) => {
    merge(newAggsState, defaultAggs);
    merge(newQueryState, defaultQuery);

    const data = {
      aggs: newAggsState,
      query: newQueryState,
    };

    render(<ActionBar />, {
      preloadedState: data,
    });
  };

  let gaSpy;
  const { location } = window;
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

  test('rendering', () => {
    const aggs = {
      doc_count: 100,
      total: 10,
    };

    const query = {
      tab: 'Map',
    };

    const dataExportSpy = jest
      .spyOn(dataExportActions, 'showExportDialog')
      .mockImplementation(() => jest.fn());
    renderComponent(aggs, query);

    expect(
      screen.getByText('Showing 10 matches out of 100 total complaints')
    ).toBeInTheDocument();
    const buttonExport = screen.getByRole('button', { name: 'Export data' });
    expect(buttonExport).toBeInTheDocument();
    fireEvent.click(buttonExport);
    expect(dataExportSpy).toHaveBeenCalledTimes(1);

    const buttonPrint = screen.getByRole('button', { name: 'Print' });
    expect(buttonPrint).toBeInTheDocument();
    fireEvent.click(buttonPrint);

    expect(window.location.assign).toHaveBeenCalledWith(
      'http://ccdb-website.gov&isPrintMode=true&isFromExternal=true'
    );
    expect(gaSpy).toHaveBeenCalledWith('Print', 'tab:Map');
  });
});
