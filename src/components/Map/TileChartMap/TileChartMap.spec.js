import { TileChartMap } from './TileChartMap';
import {
  testRender as render,
  fireEvent,
  screen,
} from '../../../testUtils/test-utils';
import { merge } from '../../../testUtils/functionHelpers';
import { filtersState } from '../../../reducers/filters/filtersSlice';
import fetchMock from 'jest-fetch-mock';
import { viewState } from '../../../reducers/view/viewSlice';
import { mapResults } from './__fixtures__/mapResults';
import { GEO_NORM_PER1000, MODE_MAP } from '../../../constants';
import * as analyticsActions from '../../../utils';
import * as filterActions from '../../../reducers/filters/filtersSlice';

describe('TileChartMap', () => {
  const renderComponent = (newFiltersState, newViewState) => {
    newViewState.tab = MODE_MAP;
    merge(newFiltersState, filtersState);
    merge(newViewState, viewState);

    const data = {
      filters: newFiltersState,
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

  it('renders empty set without crashing', () => {
    renderComponent({}, {});
    expect(screen.getByTestId('tile-chart-map')).toBeInTheDocument();
    expect(screen.getByTestId('tile-chart-map')).not.toHaveClass('print');
  });

  it('renders print mode', () => {
    renderComponent({}, { isPrintMode: true });
    expect(screen.getByTestId('tile-chart-map')).toBeInTheDocument();
    expect(screen.getByTestId('tile-chart-map')).toHaveClass('print');
  });

  it('renders map with complaint counts', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mapResults));
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

    // need to mouseover to initialize the toggleState handler
    fireEvent.mouseEnter(screen.getByLabelText('FL, value: 580,351.'));
    fireEvent.click(screen.getByLabelText('FL, value: 580,351.'));

    expect(analyticsSpy).toHaveBeenCalledWith('State Event: add', 'FL');

    expect(addStateFilterSpy).toHaveBeenCalledWith({
      abbr: 'FL',
      name: 'Florida',
    });
  });

  it('renders map with per capita values', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mapResults));

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

    expect(screen.getByText('Complaints per 1,000')).toBeInTheDocument();
    expect(screen.getByText('FL')).toBeInTheDocument();
    expect(screen.getByText('28.62')).toBeInTheDocument();

    // tooltip check
    fireEvent.mouseEnter(screen.getByLabelText('FL, value: 580,351.'));

    expect(
      screen.getByText('Product with highest complaint volume'),
    ).toBeVisible();

    fireEvent.click(screen.getByLabelText('FL, value: 580,351.'));
    expect(analyticsSpy).toHaveBeenCalledWith('State Event: add', 'FL');
    expect(addStateFilterSpy).toHaveBeenCalledWith({
      abbr: 'FL',
      name: 'Florida',
    });
  });

  it('removes map filters when state filters exist', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mapResults));

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

    expect(await screen.findByText('FL')).toBeInTheDocument();
    expect(await screen.findByText('580,351')).toBeInTheDocument();

    // need to mouseEnter to initialize the toggleState handler!
    fireEvent.mouseEnter(screen.getByLabelText('FL, value: 580,351.'));
    fireEvent.click(screen.getByLabelText('FL, value: 580,351.'));
    expect(analyticsSpy).toHaveBeenCalledWith('State Event: remove', 'FL');
    expect(removeStateFilterSpy).toHaveBeenCalledWith({
      abbr: 'FL',
      name: 'Florida',
    });
  });

  it('removes per capita map filters when state filters exist', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mapResults));
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

    expect(screen.getByLabelText('OK, value: 20,067.')).toHaveClass(
      'deselected',
    );
    expect(screen.getByLabelText('FL, value: 580,351.')).toHaveClass(
      'selected',
    );

    // need to mouseEnter to initialize the toggleState handler!
    fireEvent.mouseEnter(screen.getByLabelText('FL, value: 580,351.'));
    fireEvent.click(screen.getByLabelText('FL, value: 580,351.'));

    expect(analyticsSpy).toHaveBeenCalledWith('State Event: remove', 'FL');
    expect(removeStateFilterSpy).toHaveBeenCalledWith({
      abbr: 'FL',
      name: 'Florida',
    });
  });
});
