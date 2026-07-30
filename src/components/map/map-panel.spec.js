import { filtersState } from '../../reducers/filters/filters-slice';
import { queryState } from '../../reducers/query/query-slice';
import { viewState } from '../../reducers/view/view-slice';
import { MapPanel } from './map-panel';
import { merge } from '../../test-utils/function-helpers';
import { screen, testRender as render } from '../../test-utils/test-utils';
import { MODE_MAP } from '../../constants';
import fetchMock from 'jest-fetch-mock';
import { aggResponse } from './fixture';
import { trendsState } from '../../reducers/trends/trends-slice';

// have to stub this out because I can't figure out how to get the d3 chart to render
// without mocking everything
jest.mock('../charts/row-chart/row-chart', () => ({
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
    expect(
      screen.getAllByRole('button', { name: /Close filters/ }),
    ).toHaveLength(2);
    expect(screen.getByText('Filter results by...')).toBeInTheDocument();
  });

  it('renders error', async () => {
    fetchMock.mockResponse((req) => {
      if (req.url.includes('API?')) {
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
