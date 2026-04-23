import { filtersState } from '../../reducers/filters/filtersSlice';
import { queryState } from '../../reducers/query/querySlice';
import { viewState } from '../../reducers/view/viewSlice';
import { MapPanel } from './MapPanel';
import { merge } from '../../testUtils/functionHelpers';
import { screen, testRender as render } from '../../testUtils/test-utils';
import { MODE_MAP } from '../../constants';
import fetchMock from 'jest-fetch-mock';
import { aggResponse } from './fixture';
import { trendsState } from '../../reducers/trends/trendsSlice';

// have to stub this out because I can't figure out how to get the d3 chart to render
// without mocking everything
jest.mock('../Charts/RowChart/RowChart', () => ({
  RowChart: () => <div>ROW CHART</div>,
}));

describe('MapPanel', () => {
  const renderComponent = (newFiltersState, newQueryState, newViewState) => {
    merge(newFiltersState, filtersState);
    merge(newQueryState, queryState);
    merge(newViewState, viewState);

    const data = {
      filters: newFiltersState,
      query: newQueryState,
      routes: { queryString: '?dsfsf' },
      trends: trendsState,
      view: newViewState,
    };

    render(<MapPanel />, {
      preloadedState: data,
    });
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders empty state without crashing', async () => {
    renderComponent({}, {}, {});
    await screen.findByText('Showing 0 total complaints');
    expect(screen.getByText(/Showing 0 total complaints/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Trends/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /List/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Map/ })).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /Close filters/ }),
    ).toHaveLength(2);
    expect(screen.getByText('Filter results by...')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Export data/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Print/ })).toBeInTheDocument();
  });

  it('renders error', async () => {
    fetchMock.mockResponse((req) => {
      if (req.url.indexOf('API?') > -1) {
        return Promise.resolve({
          body: JSON.stringify(aggResponse),
        });
      }
    });
    fetchMock.mockReject(new Error('Something broke'));

    const filters = {
      has_narrative: true,
    };

    const query = {
      dateLastIndexed: '2020-11-07',
      date_received_min: '2017-10-07',
      date_received_max: '2020-10-07',
    };

    const view = {
      expandedRows: [],
      tab: MODE_MAP,
      width: 1000,
    };

    renderComponent(filters, query, view);
    await screen.findByRole('alert');
    expect(screen.getByRole('alert')).toHaveTextContent(
      'There was a problem executing your search',
    );
  });
});
