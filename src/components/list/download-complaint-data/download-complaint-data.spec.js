import { DownloadComplaintData } from './download-complaint-data';
import * as utils from '../../../utils';
import {
  act,
  configureStoreUtil,
  screen,
  testRender as render,
} from '../../../test-utils/test-utils';
import { merge } from '../../../test-utils/function-helpers';
import {
  filterAdded,
  filtersState,
} from '../../../reducers/filters/filters-slice';
import { queryState } from '../../../reducers/query/query-slice';
import { viewState } from '../../../reducers/view/view-slice';
import { MODE_LIST } from '../../../constants';
import fetchMock from 'jest-fetch-mock';
import { aggResponse } from '../list-panel/fixture';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import * as aggregationHooks from '../../../api/hooks/use-get-aggregations';

const withHitTotal = (total) => {
  const response = structuredClone(aggResponse);
  response.hits.total.value = total;
  return response;
};

describe('DownloadComplaintData', () => {
  const renderComponent = (newFiltersState = {}, newQueryState = {}) => {
    merge(newQueryState, { dateLastIndexed: '2020-01-01' });
    merge(newFiltersState, filtersState);
    merge(newQueryState, queryState);

    const preloadedState = {
      filters: newFiltersState,
      query: newQueryState,
      routes: { queryString: '?foo=bar' },
      view: { ...viewState, tab: MODE_LIST },
    };
    const store = configureStoreUtil(preloadedState);

    render(<DownloadComplaintData />, {
      preloadedState,
      store,
    });

    return { store };
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('renders download links for all and filtered data', async () => {
    const analyticsSpy = jest
      .spyOn(utils, 'sendAnalyticsEvent')
      .mockImplementation(() => {});
    fetchMock.mockResponseOnce(JSON.stringify(withHitTotal(50_000)));
    const user = userEvent.setup({ delay: null });

    renderComponent(
      { has_narrative: true },
      { searchText: 'foo', dateReceivedMax: '2020-05-05' },
    );

    const allLink = await screen.findByRole('link', {
      name: /Download all complaints/,
    });
    expect(allLink).toHaveAttribute(
      'href',
      'https://files.consumerfinance.gov/ccdb/complaints.csv.zip',
    );

    await waitFor(() => {
      expect(
        screen.getByRole('link', { name: /Download filtered results/ }),
      ).toHaveAttribute('href', expect.stringContaining('size=50000'));
    });

    const filteredLink = screen.getByRole('link', {
      name: /Download filtered results/,
    });
    expect(filteredLink).toHaveAttribute(
      'href',
      expect.stringContaining('format=csv'),
    );
    expect(filteredLink).toHaveAttribute(
      'href',
      expect.not.stringContaining('frm='),
    );
    expect(filteredLink).toHaveAttribute(
      'href',
      expect.not.stringContaining('search_after'),
    );

    await user.click(allLink);
    expect(analyticsSpy).toHaveBeenCalledWith('Export All Data', 'List:csv');
    expect(
      screen.getByText('Your data file is downloading'),
    ).toBeInTheDocument();

    await user.click(filteredLink);
    expect(analyticsSpy).toHaveBeenCalledWith('Export Some Data', 'List');
    expect(
      screen.getByText('Your data file is downloading'),
    ).toBeInTheDocument();
  });

  it('shows an error after an over-limit filtered download is attempted', async () => {
    const aggregationsSpy = jest
      .spyOn(aggregationHooks, 'useGetAggregations')
      .mockReturnValue({ data: { total: 200_000 } });
    const user = userEvent.setup({ delay: null });

    const { store } = renderComponent({ has_narrative: true });

    const filteredLink = await screen.findByRole('link', {
      name: /Download filtered results/,
    });
    expect(filteredLink).not.toHaveAttribute('aria-disabled', 'true');
    expect(
      screen.queryByText(/exceed download limits/),
    ).not.toBeInTheDocument();

    await user.click(filteredLink);
    expect(screen.getByText(/exceed download limits/)).toBeInTheDocument();
    expect(
      screen.queryByText('Your data file is downloading'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Download all complaints/ }),
    ).toBeInTheDocument();

    // Still over limit — alert should fade away when filters change.
    act(() => {
      store.dispatch(filterAdded('product', 'Credit card'));
    });

    await waitFor(() => {
      expect(
        screen.queryByText(/exceed download limits/),
      ).not.toBeInTheDocument();
    });
    aggregationsSpy.mockRestore();
  });

  it('shows an error when no search terms or filters are applied', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(withHitTotal(50_000)));
    const user = userEvent.setup({ delay: null });

    const { store } = renderComponent();

    const filteredLink = await screen.findByRole('link', {
      name: /Download filtered results/,
    });
    await user.click(filteredLink);

    expect(
      screen.getByText(/You must add search terms or apply filters/),
    ).toBeInTheDocument();

    act(() => {
      store.dispatch(filterAdded('product', 'Credit card'));
    });

    await waitFor(() => {
      expect(
        screen.queryByText(/You must add search terms or apply filters/),
      ).not.toBeInTheDocument();
    });
  });
});
