import { DataExport } from './data-export';
import * as utils from '../../../utils';
import {
  fireEvent,
  screen,
  testRender as render,
} from '../../../test-utils/test-utils';
import { merge } from '../../../test-utils/function-helpers';
import { filtersState } from '../../../reducers/filters/filters-slice';
import { queryState } from '../../../reducers/query/query-slice';
import * as viewActions from '../../../reducers/view/view-slice';
import { viewState } from '../../../reducers/view/view-slice';
import { MODAL_TYPE_EXPORT_CONFIRMATION } from '../../../constants';
import { waitFor } from '@testing-library/react';
import * as aggregationHooks from '../../../api/hooks/use-get-aggregations';

const FILTER_DOWNLOAD_EMPTY_MESSAGE =
  'Filtered option is unavailable. You must add search terms or apply filters to download filtered results.';
const FILTER_DOWNLOAD_LIMIT_MESSAGE =
  'Filtered option is unavailable as filtered results exceed download limit. Refine your search terms and filters to reduce the number of complaints.';

const withHitTotal = (total, docCount = total) => ({
  total,
  doc_count: docCount,
});

describe('DataExport', () => {
  const originalClipboard = { ...navigator.clipboard };

  const renderComponent = (
    newFiltersState = {},
    newQueryState = {},
    newViewState = {},
  ) => {
    const mockClipboard = {
      writeText: rs.fn(),
    };
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true,
      configurable: true, // Allows it to be changed or reset later
    });

    merge(newQueryState, { dateLastIndexed: '2020-01-01' });
    merge(newFiltersState, filtersState);
    merge(newQueryState, queryState);
    merge(newViewState, viewState);

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
    rs.resetAllMocks();
    Object.defineProperty(navigator, 'clipboard', {
      ...originalClipboard,
    });
  });

  it('renders default state without crashing', async () => {
    const modalHiddenSpy = rs
      .spyOn(viewActions, 'modalHidden')
      .mockImplementation(() => rs.fn());
    renderComponent({});
    expect(screen.getByText('Download complaint data')).toBeInTheDocument();
    expect(
      screen.getByText(/Select the data you would like to download/),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Save a link to your filtered results'),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('radio', { name: /JSON/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(FILTER_DOWNLOAD_EMPTY_MESSAGE)).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Download data/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    const buttonCopy = screen.getByRole('button', { name: /Copy link/ });
    expect(buttonCopy).toBeInTheDocument();
    fireEvent.click(buttonCopy);
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Link copied/ }),
      ).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /Close/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Close/i }));
    expect(modalHiddenSpy).toHaveBeenCalled();
  });

  it('closes the modal by clicking cancel', async () => {
    const modalHiddenSpy = rs
      .spyOn(viewActions, 'modalHidden')
      .mockImplementation(() => rs.fn());
    renderComponent({});
    expect(screen.getByText('Download complaint data')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(modalHiddenSpy).toHaveBeenCalled();
  });

  it('defaults to all complaint data and shows empty-filter alert', () => {
    renderComponent({});

    const radioFiltered = screen.getByRole('radio', {
      name: /Filtered results/i,
    });
    const radioFull = screen.getByRole('radio', {
      name: /All complaint data/i,
    });

    expect(radioFiltered).toBeDisabled();
    expect(radioFiltered).not.toBeChecked();
    expect(radioFull).toBeChecked();
    expect(screen.getByText(FILTER_DOWNLOAD_EMPTY_MESSAGE)).toBeInTheDocument();
    expect(
      screen.queryByText(FILTER_DOWNLOAD_LIMIT_MESSAGE),
    ).not.toBeInTheDocument();
  });

  it('downloads all complaint data as CSV', async () => {
    const modalShownSpy = rs
      .spyOn(viewActions, 'modalShown')
      .mockImplementation(() => rs.fn());
    const sendAnalyticsSpy = rs
      .spyOn(utils, 'sendAnalyticsEvent')
      .mockImplementation(() => rs.fn());
    renderComponent({});

    fireEvent.click(screen.getByRole('button', { name: /Download data/ }));
    expect(sendAnalyticsSpy).toHaveBeenCalledWith('Export All Data', 'csv');
    expect(modalShownSpy).toHaveBeenCalledWith(MODAL_TYPE_EXPORT_CONFIRMATION);
  });

  it('defaults to filtered results when under the download limit', async () => {
    const aggregationsSpy = rs
      .spyOn(aggregationHooks, 'useGetAggregations')
      .mockReturnValue({ data: withHitTotal(50_000, 6_000_000) });
    const modalShownSpy = rs
      .spyOn(viewActions, 'modalShown')
      .mockImplementation(() => rs.fn());
    const sendAnalyticsSpy = rs
      .spyOn(utils, 'sendAnalyticsEvent')
      .mockImplementation(() => rs.fn());

    renderComponent(
      { issue: ['foo'], product: ['bar', 'baz'], state: ['TX', 'CA'] },
      {
        date_received_max: '2020-05-05',
        date_received_min: '2017-05-05',
        searchText: 'debt',
      },
      {},
    );

    const radioFiltered = screen.getByRole('radio', {
      name: /Filtered results \(50,000 complaints\)/i,
    });
    expect(radioFiltered).toBeEnabled();
    expect(radioFiltered).toBeChecked();
    expect(
      screen.queryByText(FILTER_DOWNLOAD_EMPTY_MESSAGE),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(FILTER_DOWNLOAD_LIMIT_MESSAGE),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Download data/ }));
    expect(sendAnalyticsSpy).toHaveBeenCalledWith(
      'Export Some Data',
      'filtered',
    );
    expect(modalShownSpy).toHaveBeenCalledWith(MODAL_TYPE_EXPORT_CONFIRMATION);

    aggregationsSpy.mockRestore();
  });

  it('disables filtered results and shows limit alert when over 100,000', async () => {
    const aggregationsSpy = rs
      .spyOn(aggregationHooks, 'useGetAggregations')
      .mockReturnValue({ data: withHitTotal(150_000, 6_000_000) });
    renderComponent({ product: ['Mortgage'] }, { searchText: 'debt' }, {});

    await screen.findByText(FILTER_DOWNLOAD_LIMIT_MESSAGE);

    const radioFiltered = screen.getByRole('radio', {
      name: /Filtered results/i,
    });
    const radioFull = screen.getByRole('radio', {
      name: /All complaint data/i,
    });

    expect(radioFiltered).toBeDisabled();
    expect(radioFull).toBeChecked();
    expect(
      screen.getByText(/limited to 100,000 complaints or fewer/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/large, zipped CSV file of every complaint/),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(FILTER_DOWNLOAD_EMPTY_MESSAGE),
    ).not.toBeInTheDocument();

    aggregationsSpy.mockRestore();
  });

  it('switches dataset selections when filtered is available', async () => {
    const aggregationsSpy = rs
      .spyOn(aggregationHooks, 'useGetAggregations')
      .mockReturnValue({ data: withHitTotal(50_000, 6_000_000) });

    renderComponent({ product: ['Mortgage'] }, { searchText: 'foo' }, {});

    const radioFiltered = screen.getByRole('radio', {
      name: /Filtered results/i,
    });
    const radioFull = screen.getByRole('radio', {
      name: /All complaint data/i,
    });
    expect(radioFiltered).toBeChecked();
    expect(radioFull).not.toBeChecked();

    fireEvent.click(radioFull);
    await waitFor(() => {
      expect(radioFull).toBeChecked();
    });
    await waitFor(() => {
      expect(radioFiltered).not.toBeChecked();
    });

    fireEvent.click(radioFiltered);
    await waitFor(() => {
      expect(radioFiltered).toBeChecked();
    });

    aggregationsSpy.mockRestore();
  });
});
