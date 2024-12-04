import { ActionBar } from './ActionBar';
import { viewState } from '../../reducers/view/viewSlice';
import { merge } from '../../testUtils/functionHelpers';
import {
  testRender as render,
  screen,
  fireEvent,
} from '../../testUtils/test-utils';
import * as viewActions from '../../reducers/view/viewSlice';
import * as utils from '../../utils';
import fetchMock from 'jest-fetch-mock';
import { aggResponse } from '../List/ListPanel/fixture';

describe('ActionBar', () => {
  const renderComponent = (newViewState) => {
    merge(newViewState, viewState);

    const data = {
      routes: { queryString: '?sdafds' },
      view: newViewState,
    };

    render(<ActionBar />, {
      preloadedState: data,
    });
  };

  let gaSpy;
  beforeEach(() => {
    gaSpy = jest.spyOn(utils, 'sendAnalyticsEvent');
    fetchMock.resetMocks();
  });

  test('rendering', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(aggResponse));

    const view = {
      tab: 'Map',
    };

    const printModeOnSpy = jest
      .spyOn(viewActions, 'updatePrintModeOn')
      .mockImplementation(() => jest.fn());

    const dataExportSpy = jest
      .spyOn(viewActions, 'modalShown')
      .mockImplementation(() => jest.fn());
    renderComponent(view);

    await screen.findByText(
      'Showing 4,303,365 matches out of 6,638,372 total complaints',
    );
    expect(
      screen.getByText(
        'Showing 4,303,365 matches out of 6,638,372 total complaints',
      ),
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
