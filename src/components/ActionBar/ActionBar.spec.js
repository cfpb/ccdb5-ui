import React from 'react';
import { ActionBar } from './ActionBar';
import { aggsState } from '../../reducers/aggs/aggsSlice';
import { viewState } from '../../reducers/view/viewSlice';
import { merge } from '../../testUtils/functionHelpers';
import { testRender as render, screen } from '../../testUtils/test-utils';
import * as viewActions from '../../reducers/view/viewSlice';
import * as utils from '../../utils';
import userEvent from '@testing-library/user-event';

jest.useRealTimers();
describe('ActionBar', () => {
  const user = userEvent.setup();
  const renderComponent = (newAggsState, newViewState) => {
    merge(newAggsState, aggsState);
    merge(newViewState, viewState);

    const data = {
      aggs: newAggsState,
      view: newViewState,
    };

    render(<ActionBar />, {
      preloadedState: data,
    });
  };

  let gaSpy;
  beforeEach(() => {
    gaSpy = jest.spyOn(utils, 'sendAnalyticsEvent');
  });

  test('rendering', async () => {
    const aggs = {
      doc_count: 100,
      total: 10,
    };

    const view = {
      tab: 'Map',
    };

    const printModeOnSpy = jest
      .spyOn(viewActions, 'updatePrintModeOn')
      .mockImplementation(() => jest.fn());

    const dataExportSpy = jest
      .spyOn(viewActions, 'modalShown')
      .mockImplementation(() => jest.fn());
    renderComponent(aggs, view);

    expect(
      screen.getByText('Showing 10 matches out of 100 total complaints'),
    ).toBeInTheDocument();
    const buttonExport = screen.getByRole('button', { name: /Export data/ });
    expect(buttonExport).toBeInTheDocument();
    await user.click(buttonExport);
    expect(dataExportSpy).toHaveBeenCalledTimes(1);

    const buttonPrint = screen.getByRole('button', { name: /Print/ });
    expect(buttonPrint).toBeInTheDocument();
    await user.click(buttonPrint);
    expect(gaSpy).toHaveBeenCalledWith('Print', 'tab:Map');
    expect(printModeOnSpy).toHaveBeenCalledTimes(1);
  });
});
