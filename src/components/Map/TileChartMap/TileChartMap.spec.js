import { TileChartMap } from './TileChartMap';
import { screen, testRender as render } from '../../../testUtils/test-utils';
import { merge } from '../../../testUtils/functionHelpers';
import * as filterActions from '../../../reducers/filters/filtersSlice';
import { filtersState } from '../../../reducers/filters/filtersSlice';
import Highcharts from 'highcharts/highmaps';
import fetchMock from 'jest-fetch-mock';
import { viewState } from '../../../reducers/view/viewSlice';
import { mapResults } from './__fixtures__/mapResults';
import { GEO_NORM_PER1000, MODE_MAP } from '../../../constants';
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
    Highcharts.charts.filter(Boolean).forEach((chart) => chart.destroy());
  });

  it('renders empty set without crashing', () => {
    fetchMock.mockResponse(JSON.stringify(mapResults));
    renderComponent({}, {});
    expect(screen.getByTestId('tile-chart-map')).toBeInTheDocument();
    expect(screen.getByTestId('tile-chart-map')).not.toHaveClass('print');
  });

  it('renders print mode', () => {
    fetchMock.mockResponse(JSON.stringify(mapResults));
    renderComponent({}, { isPrintMode: true });
    expect(screen.getByTestId('tile-chart-map')).toBeInTheDocument();
    expect(screen.getByTestId('tile-chart-map')).toHaveClass('print');
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
    expect(screen.getByTestId('tile-chart-map')).toBeInTheDocument();
    expect(screen.getByTestId('tile-chart-map')).not.toHaveClass('print');
    expect(screen.getByText('FL')).toBeInTheDocument();
    expect(screen.getByText('580,351')).toBeInTheDocument();
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

  it('renders map with per capita values', async () => {
    fetchMock.mockResponse(JSON.stringify(mapResults));
    const analyticsSpy = jest
      .spyOn(analyticsActions, 'sendAnalyticsEvent')
      .mockImplementation(() => jest.fn());

    const addStateFilterSpy = jest
      .spyOn(filterActions, 'stateFilterAdded')
      .mockImplementation(() => jest.fn());

    const newFilters = {
      dataNormalization: GEO_NORM_PER1000,
    };

    const newView = {
      isPrintMode: false,
      width: 1000,
    };

    renderComponent(newFilters, newView);
    expect(screen.getByTestId('tile-chart-map')).toBeInTheDocument();
    expect(screen.getByTestId('tile-chart-map')).not.toHaveClass('print');

    await screen.findByLabelText('FL, value: 580,351.');
    expect(screen.getByLabelText('FL, value: 580,351.')).toBeInTheDocument();
    expect(screen.getByText('Complaints per 1,000')).toBeInTheDocument();
    expect(screen.getByText('FL')).toBeInTheDocument();
    expect(screen.getByText('28.62')).toBeInTheDocument();
    // tooltip check
    const { chart, point } = getTileMapPoint('FL');
    expect(chart).toBeDefined();
    expect(point).toBeDefined();
    chart.tooltip.refresh(point);
    expect(
      screen.getByText('Product with highest complaint volume'),
    ).toBeVisible();
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
    expect(screen.getByTestId('tile-chart-map')).toBeInTheDocument();
    expect(screen.getByTestId('tile-chart-map')).not.toHaveClass('print');
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

  it('removes per capita map filters when state filters exist', async () => {
    fetchMock.mockResponse(JSON.stringify(mapResults));
    const analyticsSpy = jest
      .spyOn(analyticsActions, 'sendAnalyticsEvent')
      .mockImplementation(() => jest.fn());

    const removeStateFilterSpy = jest
      .spyOn(filterActions, 'stateFilterRemoved')
      .mockImplementation(() => jest.fn());

    const newFilters = {
      dataNormalization: GEO_NORM_PER1000,
      state: ['FL', 'TX'],
    };

    const newView = {
      isPrintMode: false,
      width: 1000,
    };

    renderComponent(newFilters, newView);
    expect(screen.getByTestId('tile-chart-map')).toBeInTheDocument();
    expect(screen.getByTestId('tile-chart-map')).not.toHaveClass('print');
    expect(await screen.findByText('FL')).toBeInTheDocument();
    expect(await screen.findByText('28.62')).toBeInTheDocument();
    expect(screen.getByLabelText('FL, value: 580,351.')).toBeInTheDocument();
    expect(screen.getByLabelText('OK, value: 20,067.')).toHaveClass(
      'deselected',
    );
    expect(screen.getByLabelText('FL, value: 580,351.')).toHaveClass(
      'selected',
    );
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
