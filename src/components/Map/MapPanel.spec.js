import { filtersState } from '../../reducers/filters/filtersSlice';
import { queryState } from '../../reducers/query/querySlice';
import { viewState } from '../../reducers/view/viewSlice';
import { MapPanel } from './MapPanel';
import { merge } from '../../testUtils/functionHelpers';
import {
  testRender as render,
  fireEvent,
  screen,
} from '../../testUtils/test-utils';
import { MODE_MAP } from '../../constants';
import * as viewActions from '../../reducers/filters/filtersSlice';
import fetchMock from 'jest-fetch-mock';
import { aggResponse, geoResponse } from './fixture';
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
    // merge({}, trendsState);
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
      screen.getByRole('button', { name: /Close filters/ }),
    ).toBeInTheDocument();
    expect(screen.getByText('Filter results by...')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Export data/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Print/ })).toBeInTheDocument();
  });

  it('renders warning', async () => {
    fetchMock.mockResponse((req) => {
      if (req.url.indexOf('API/geo/states?') > -1) {
        return Promise.resolve({
          body: JSON.stringify(geoResponse),
        });
      } else if (req.url.indexOf('API?') > -1) {
        return Promise.resolve({
          body: JSON.stringify(aggResponse),
        });
      }
    });

    const filters = {
      enablePer1000: false,
      has_narrative: true,
      mapWarningEnabled: true,
    };

    const query = {
      date_received_min: '2017-10-07',
      date_received_max: '2020-10-07',
    };

    const view = {
      expandedRows: [],
      tab: MODE_MAP,
      width: 1000,
    };

    const dismissSpy = jest
      .spyOn(viewActions, 'mapWarningDismissed')
      .mockReturnValue(jest.fn());

    renderComponent(filters, query, view);

    await screen.findByText(
      'Showing 794,615 matches out of 6,708,879 total complaints',
    );
    await screen.findByRole('alert');
    expect(screen.getByRole('alert')).toHaveTextContent(
      '“Complaints per 1,000 population” is not available with your filter selections.',
    );

    expect(
      screen.getByText(
        'Showing 794,615 matches out of 6,708,879 total complaints',
      ),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Dismiss'));
    expect(dismissSpy).toHaveBeenCalledTimes(1);

    expect(
      screen.queryByRole('button', { name: /Close filters/ }),
    ).not.toBeInTheDocument();

    expect(document.getElementById('tile-chart-map')).toBeInTheDocument();
    expect(screen.getByText('ROW CHART')).toBeInTheDocument();
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
      enablePer1000: true,
      has_narrative: true,
      mapWarningEnabled: false,
    };

    const query = {
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

    expect(
      screen.queryByRole('button', { name: /Close filters/ }),
    ).not.toBeInTheDocument();
  });
});
