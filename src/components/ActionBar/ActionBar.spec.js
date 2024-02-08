import React from 'react';
import { ActionBar } from './ActionBar';
import { aggState } from '../../reducers/aggs/aggs';
import { queryState } from '../../reducers/query/query';
import { merge } from '../../testUtils/functionHelpers';
import {
  testRender as render,
  fireEvent,
  screen,
} from '../../testUtils/test-utils';
import * as viewActions from '../../reducers/view/view';
import * as utils from '../../utils';

describe('ActionBar', () => {
  const renderComponent = (newAggsState, newQueryState) => {
    merge(newAggsState, aggState);
    merge(newQueryState, queryState);

    const data = {
      aggs: newAggsState,
      query: newQueryState,
    };

    render(<ActionBar />, {
      preloadedState: data,
    });
  };

  let gaSpy;
  beforeEach(() => {
    gaSpy = jest.spyOn(utils, 'sendAnalyticsEvent');
  });

  test('rendering', () => {
    const aggs = {
      doc_count: 100,
      total: 10,
    };

    const query = {
      tab: 'Map',
    };

    const printModeOnSpy = jest
      .spyOn(viewActions, 'updatePrintModeOn')
      .mockImplementation(() => jest.fn());

    const dataExportSpy = jest
      .spyOn(viewActions, 'modalShown')
      .mockImplementation(() => jest.fn());
    renderComponent(aggs, query);

    expect(
      screen.getByText('Showing 10 matches out of 100 total complaints')
    ).toBeInTheDocument();
    const buttonExport = screen.getByRole('button', { name: /Export data/ });
    expect(buttonExport).toBeInTheDocument();
    fireEvent.click(buttonExport);
    expect(dataExportSpy).toHaveBeenCalledTimes(1);

    const buttonPrint = screen.getByRole('button', { name: /Print/ });
    expect(buttonPrint).toBeInTheDocument();
    fireEvent.click(buttonPrint);
    expect(gaSpy).toHaveBeenCalledWith('Print', 'tab:Map');
    expect(printModeOnSpy).toHaveBeenCalledTimes(1);
  });
});
