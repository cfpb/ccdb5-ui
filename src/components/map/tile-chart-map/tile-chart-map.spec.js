import { TileChartMap } from './tile-chart-map';
import { screen, testRender as render } from '../../../test-utils/test-utils';
import { merge } from '../../../test-utils/function-helpers';
import * as filterActions from '../../../reducers/filters/filters-slice';
import { filtersState } from '../../../reducers/filters/filters-slice';
import Highcharts from 'highcharts/highmaps';
import fetchMock from 'jest-fetch-mock';
import { viewState } from '../../../reducers/view/view-slice';
import { mapResults } from './__fixtures__/map-results';
import { MODE_MAP } from '../../../constants';
import * as analyticsActions from '../../../utils';

describe('TileChartMap', () => {
  const getTileMapChart = () =>
    Highcharts.charts.find(
      (chart) => chart?.renderTo && chart.renderTo.id === 'tile-chart-map',
    );

  const getTileMapPoint = (abbr) => {
    const chart = getTileMapChart();
    const point = chart?.series?.[0]?.points?.find(
      (candidate) => candidate.name === abbr,
    );
    return { chart, point };
  };

  const renderComponent = (newFiltersState, newViewState) => {
    newViewState.tab = MODE_MAP;
    merge(newFiltersState, filtersState);
    merge(newViewState, viewState);

    const data = {
      filters: newFiltersState,
      query: { dateLastIndexed: '2021-10-07' },
      routes: { queryString: '?fasf=sdfsr' },
      view: newViewState,
    };
    render(<TileChartMap />, {
      preloadedState: data,
    });
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    for (const chart of Highcharts.charts) {
      if (chart) {
        chart.destroy();
      }
    }
  });

  it('renders empty set without crashing', () => {
    fetchMock.mockResponse(JSON.stringify(mapResults));
    renderComponent({}, {});
    expect(document.getElementById('tile-chart-map')).toBeInTheDocument();
    expect(document.getElementById('tile-chart-map')).not.toHaveClass('print');
  });

  it('renders print mode', () => {
    fetchMock.mockResponse(JSON.stringify(mapResults));
    renderComponent({}, { isPrintMode: true });
    expect(document.getElementById('tile-chart-map')).toBeInTheDocument();
    expect(document.getElementById('tile-chart-map')).toHaveClass('print');
  });

  it('renders map with complaint counts', async () => {
    fetchMock.mockResponse(JSON.stringify(mapResults));
    const analyticsSpy = jest
      .spyOn(analyticsActions, 'sendAnalyticsEvent')
      .mockImplementation(() => jest.fn());

    const addStateFilterSpy = jest
      .spyOn(filterActions, 'stateFilterAdded')
      .mockImplementation(() => jest.fn());

    const newView = {
      isPrintMode: false,
      width: 1000,
    };

    renderComponent({}, newView);
    await screen.findByText('FL');
    expect(document.getElementById('tile-chart-map')).toBeInTheDocument();
    expect(document.getElementById('tile-chart-map')).not.toHaveClass('print');
    expect(screen.getByText('FL')).toBeInTheDocument();
    expect(screen.getByText('580K')).toBeInTheDocument();
    expect(screen.getByLabelText('FL, value: 580,351.')).toBeInTheDocument();
    const { point } = getTileMapPoint('FL');
    expect(point).toBeDefined();
    point.firePointEvent('click', { point });

    expect(analyticsSpy).toHaveBeenCalledWith('State Event: add', 'FL');
    expect(addStateFilterSpy).toHaveBeenCalledWith({
      abbr: 'FL',
      name: 'Florida',
    });
  });

  it('removes map filters when state filters exist', async () => {
    fetchMock.mockResponse(JSON.stringify(mapResults));

    const analyticsSpy = jest
      .spyOn(analyticsActions, 'sendAnalyticsEvent')
      .mockImplementation(() => jest.fn());

    const removeStateFilterSpy = jest
      .spyOn(filterActions, 'stateFilterRemoved')
      .mockImplementation(() => jest.fn());

    const newFilters = {
      state: ['FL', 'TX'],
    };

    const newView = {
      isPrintMode: false,
      width: 1000,
    };

    renderComponent(newFilters, newView);
    expect(document.getElementById('tile-chart-map')).toBeInTheDocument();
    expect(document.getElementById('tile-chart-map')).not.toHaveClass('print');
    await screen.findByLabelText('FL, value: 580,351.');
    expect(screen.getByLabelText('FL, value: 580,351.')).toBeInTheDocument();
    const { point } = getTileMapPoint('FL');
    expect(point).toBeDefined();
    point.firePointEvent('click', { point });
    expect(analyticsSpy).toHaveBeenCalledWith('State Event: remove', 'FL');
    expect(removeStateFilterSpy).toHaveBeenCalledWith({
      abbr: 'FL',
      name: 'Florida',
    });
  });
});
