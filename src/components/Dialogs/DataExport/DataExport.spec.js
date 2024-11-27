import { DataExport } from './DataExport';
import * as utils from '../../../utils';
import {
  testRender as render,
  screen,
  fireEvent,
} from '../../../testUtils/test-utils';
import { merge } from '../../../testUtils/functionHelpers';
import { filtersState } from '../../../reducers/filters/filtersSlice';
import { queryState } from '../../../reducers/query/querySlice';
import { viewState } from '../../../reducers/view/viewSlice';
import * as viewActions from '../../../reducers/view/viewSlice';
import {
  MODAL_TYPE_EXPORT_CONFIRMATION,
  MODE_LIST,
  MODE_TRENDS,
} from '../../../constants';
import { waitFor } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import { aggResponse } from '../../List/ListPanel/fixture';

describe('DataExport', () => {
  const originalClipboard = { ...global.navigator.clipboard };

  const renderComponent = (newFiltersState, newQueryState, newViewState) => {
    const mockClipboard = {
      writeText: jest.fn(),
    };
    global.navigator.clipboard = mockClipboard;

    merge(newFiltersState, filtersState);
    merge(newQueryState, queryState);
    merge(newQueryState, viewState);

    const data = {
      filters: newFiltersState,
      query: newQueryState,
      routes: { queryString: '?asdfds=dfsafasd' },
      view: newViewState,
    };
    render(<DataExport />, { preloadedState: data });
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });
  afterEach(() => {
    jest.resetAllMocks();
    global.navigator.clipboard = originalClipboard;
  });

  it('renders default state without crashing', async () => {
    const modalHiddenSpy = jest
      .spyOn(viewActions, 'modalHidden')
      .mockImplementation(() => jest.fn());
    renderComponent({}, {}, { tab: MODE_TRENDS });
    expect(screen.getByText('Export complaints')).toBeInTheDocument();

    // hide dataset buttons when no filters selected
    expect(
      screen.queryByText(/Select which complaints you'd like to export/),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(
        'Link to your complaint search results for future reference',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Start export/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    const buttonCopy = screen.getByRole('button', { name: /Copy/ });
    expect(buttonCopy).toBeInTheDocument();
    expect(buttonCopy).toHaveClass('a-btn__secondary');
    fireEvent.click(buttonCopy);
    await waitFor(() => {
      expect(buttonCopy).toHaveClass('export-url-copied');
    });

    expect(screen.getByRole('button', { name: /Close/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Close/i }));
    expect(modalHiddenSpy).toHaveBeenCalled();
  });

  it('closes the modal by clicking cancel', async () => {
    const modalHiddenSpy = jest
      .spyOn(viewActions, 'modalHidden')
      .mockImplementation(() => jest.fn());
    renderComponent({}, {}, { tab: MODE_LIST });
    expect(screen.getByText('Export complaints')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(modalHiddenSpy).toHaveBeenCalled();
  });

  it('exports All complaints', async () => {
    const modalShownSpy = jest
      .spyOn(viewActions, 'modalShown')
      .mockImplementation(() => jest.fn());
    const sendAnalyticsSpy = jest
      .spyOn(utils, 'sendAnalyticsEvent')
      .mockImplementation(() => jest.fn());
    renderComponent({}, {}, { tab: MODE_LIST });
    expect(screen.getByText('Export complaints')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Start export/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue(
      'https://files.consumerfinance.gov/ccdb/complaints.csv.zip',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Start export' }));
    expect(sendAnalyticsSpy).toHaveBeenCalledWith(
      'Export All Data',
      'List:csv',
    );
    expect(modalShownSpy).toHaveBeenCalledWith(MODAL_TYPE_EXPORT_CONFIRMATION);
  });

  it('exports All complaints as json', async () => {
    const modalShownSpy = jest
      .spyOn(viewActions, 'modalShown')
      .mockImplementation(() => jest.fn());
    const sendAnalyticsSpy = jest
      .spyOn(utils, 'sendAnalyticsEvent')
      .mockImplementation(() => jest.fn());
    renderComponent({}, {}, { tab: MODE_LIST });
    expect(screen.getByText('Export complaints')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Start export/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue(
      'https://files.consumerfinance.gov/ccdb/complaints.csv.zip',
    );

    const radioJson = screen.getByRole('radio', {
      name: /JSON/i,
    });
    expect(radioJson).not.toBeChecked();

    fireEvent.click(radioJson);

    await waitFor(() => {
      expect(radioJson).toBeChecked();
    });

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue(
        'https://files.consumerfinance.gov/ccdb/complaints.json.zip',
      );
    });

    fireEvent.click(screen.getByRole('button', { name: 'Start export' }));
    expect(sendAnalyticsSpy).toHaveBeenCalledWith(
      'Export All Data',
      'List:json',
    );
    expect(modalShownSpy).toHaveBeenCalledWith(MODAL_TYPE_EXPORT_CONFIRMATION);
  });

  it('exports some complaints', async () => {
    const modalShownSpy = jest
      .spyOn(viewActions, 'modalShown')
      .mockImplementation(() => jest.fn());
    const sendAnalyticsSpy = jest
      .spyOn(utils, 'sendAnalyticsEvent')
      .mockImplementation(() => jest.fn());

    fetchMock.mockResponseOnce(JSON.stringify(aggResponse));
    renderComponent(
      { doc_count: 999, total: 10000 },
      { issue: ['foo'], product: ['bar', 'baz'], state: ['TX', 'CA'] },
      { tab: MODE_LIST },
    );
    await screen.findByText(/Select which complaints you’d like to export/);
    expect(
      screen.getByText(/Select which complaints you’d like to export/),
    ).toBeInTheDocument();
    const radioFiltered = screen.getByRole('radio', {
      name: /Filtered dataset/i,
    });
    expect(radioFiltered).toBeInTheDocument();
    expect(radioFiltered).not.toBeChecked();

    const radioFull = screen.getByRole('radio', {
      name: /Full dataset/i,
    });
    expect(radioFull).toBeInTheDocument();
    expect(radioFull).toBeChecked();
    fireEvent.click(radioFiltered);
    await waitFor(() => {
      expect(radioFiltered).toBeChecked();
    });

    expect(screen.getByRole('textbox')).toHaveValue(
      'http://localhost/@@API?date_received_max=2020-05-05' +
        '&date_received_min=2017-05-05&field=all&format=csv&issue=foo' +
        '&no_aggs=true&product=bar&product=baz&size=4303365&state=TX&state=CA',
    );

    expect(
      screen.getByRole('button', { name: /Start export/ }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Start export' }));

    expect(sendAnalyticsSpy).toHaveBeenCalledWith(
      'Export Some Data',
      'List:csv',
    );
    expect(modalShownSpy).toHaveBeenCalledWith(MODAL_TYPE_EXPORT_CONFIRMATION);
  });

  it('switches csv/json data formats', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(aggResponse));
    renderComponent({}, {}, {});
    await screen.findByText(/Select which complaints you’d like to export/);
    expect(
      screen.getByText(/Select which complaints you’d like to export/),
    ).toBeInTheDocument();

    const radioJson = screen.getByRole('radio', {
      name: /JSON/i,
    });

    const radioCsv = screen.getByRole('radio', {
      name: /CSV/i,
    });
    expect(radioCsv).toBeChecked();
    expect(radioJson).not.toBeChecked();

    expect(screen.getByRole('textbox')).toHaveValue(
      'https://files.consumerfinance.gov/ccdb/complaints.csv.zip',
    );

    fireEvent.click(radioJson);

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue(
        'https://files.consumerfinance.gov/ccdb/complaints.json.zip',
      );
    });
    await waitFor(() => {
      expect(radioJson).toBeChecked();
    });

    await waitFor(() => {
      expect(radioCsv).not.toBeChecked();
    });

    fireEvent.click(radioCsv);

    await waitFor(() => {
      expect(radioCsv).toBeChecked();
    });
    await waitFor(() => {
      expect(radioJson).not.toBeChecked();
    });

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue(
        'https://files.consumerfinance.gov/ccdb/complaints.csv.zip',
      );
    });
  });

  it('switches dataset selections', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(aggResponse));
    renderComponent({}, {}, {});
    await screen.findByText(/Select which complaints you’d like to export/);
    expect(
      screen.getByText(/Select which complaints you’d like to export/),
    ).toBeInTheDocument();

    const radioFiltered = screen.getByRole('radio', {
      name: /Filtered dataset/i,
    });
    expect(radioFiltered).toBeInTheDocument();
    expect(radioFiltered).not.toBeChecked();

    const radioFull = screen.getByRole('radio', {
      name: /Full dataset/i,
    });
    expect(radioFull).toBeInTheDocument();
    expect(radioFull).toBeChecked();
    fireEvent.click(radioFiltered);
    await waitFor(() => {
      expect(radioFiltered).toBeChecked();
    });
    await waitFor(() => {
      expect(radioFull).not.toBeChecked();
    });
    fireEvent.click(radioFull);
    await waitFor(() => {
      expect(radioFiltered).not.toBeChecked();
    });
    await waitFor(() => {
      expect(radioFull).toBeChecked();
    });
  });
});
