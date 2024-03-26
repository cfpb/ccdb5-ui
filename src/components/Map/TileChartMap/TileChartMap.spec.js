import { TileChartMap } from './TileChartMap';
import React from 'react';
import {
  testRender as render,
  fireEvent,
  screen,
} from '../../../testUtils/test-utils';
import { merge } from '../../../testUtils/functionHelpers';
import { filtersState } from '../../../reducers/filters/filtersSlice';
import { mapState } from '../../../reducers/map/mapSlice';
import { viewState } from '../../../reducers/view/viewSlice';
import { mapResults } from './__fixtures__/mapResults';
import { GEO_NORM_PER1000, MODE_MAP } from '../../../constants';
import * as analyticsActions from '../../../utils';
import * as filterActions from '../../../reducers/filters/filtersSlice';

describe('TileChartMap', () => {
  const renderComponent = (newMapState, newFiltersState, newViewState) => {
    merge(newMapState, mapState);
    merge(newFiltersState, filtersState);
    merge(newViewState, viewState);

    const data = {
      filters: newFiltersState,
      map: newMapState,
      view: newViewState,
    };
    render(<TileChartMap />, {
      preloadedState: data,
    });
  };

  it('renders empty set without crashing', () => {
    renderComponent();
    expect(screen.getByTestId('tile-chart-map')).toBeInTheDocument();
    expect(screen.getByTestId('tile-chart-map')).not.toHaveClass('print');
    expect(
      screen.getByText('Map of unspecified region with 1 data series.'),
    ).toBeInTheDocument();
  });

  it('renders print mode', () => {
    renderComponent({}, {}, { isPrintMode: true });
    expect(screen.getByTestId('tile-chart-map')).toBeInTheDocument();
    expect(screen.getByTestId('tile-chart-map')).toHaveClass('print');
  });

  it('renders map with complaint counts', async () => {
    const analyticsSpy = jest
      .spyOn(analyticsActions, 'sendAnalyticsEvent')
      .mockImplementation(() => jest.fn());

    const addStateFilterSpy = jest
      .spyOn(filterActions, 'stateFilterAdded')
      .mockImplementation(() => jest.fn());

    const newMap = {
      results: {
        state: mapResults,
      },
    };

    const newView = {
      isPrintMode: false,
      width: 1000,
    };

    renderComponent(newMap, {}, newView);
    expect(screen.getByTestId('tile-chart-map')).toBeInTheDocument();
    expect(screen.getByTestId('tile-chart-map')).not.toHaveClass('print');
    expect(await screen.findByText('FL')).toBeInTheDocument();
    expect(await screen.findByText('11,397')).toBeInTheDocument();

    // need to mouseover to initialize the toggleState handler
    fireEvent.mouseEnter(screen.getByLabelText('1. FL, value: 11,397.'));
    fireEvent.click(screen.getByLabelText('1. FL, value: 11,397.'));

    expect(analyticsSpy).toHaveBeenCalledWith('State Event: add', 'FL');

    expect(addStateFilterSpy).toHaveBeenCalledWith({
      abbr: 'FL',
      name: 'Florida',
    });
  });

  it('renders map with per capita values', async () => {
    const analyticsSpy = jest
      .spyOn(analyticsActions, 'sendAnalyticsEvent')
      .mockImplementation(() => jest.fn());

    const addStateFilterSpy = jest
      .spyOn(filterActions, 'stateFilterAdded')
      .mockImplementation(() => jest.fn());

    const newMap = {
      results: {
        state: mapResults,
      },
    };

    const newFilters = {
      dataNormalization: GEO_NORM_PER1000,
    };

    const newView = {
      isPrintMode: false,
      width: 1000,
    };

    renderComponent(newMap, newFilters, newView);
    expect(screen.getByTestId('tile-chart-map')).toBeInTheDocument();
    expect(screen.getByTestId('tile-chart-map')).not.toHaveClass('print');

    await screen.findByLabelText('1. FL, value: 11,397.');

    expect(screen.getByText('Complaints per 1,000')).toBeInTheDocument();
    expect(screen.getByText('FL')).toBeInTheDocument();
    expect(screen.getByText('0.56')).toBeInTheDocument();

    // tooltip check
    fireEvent.mouseEnter(screen.getByLabelText('1. FL, value: 11,397.'));

    expect(
      screen.getByText('Product with highest complaint volume'),
    ).toBeVisible();

    fireEvent.click(screen.getByLabelText('1. FL, value: 11,397.'));
    expect(analyticsSpy).toHaveBeenCalledWith('State Event: add', 'FL');
    expect(addStateFilterSpy).toHaveBeenCalledWith({
      abbr: 'FL',
      name: 'Florida',
    });
  });

  it('removes map filters when state filters exist', async () => {
    const analyticsSpy = jest
      .spyOn(analyticsActions, 'sendAnalyticsEvent')
      .mockImplementation(() => jest.fn());

    const removeStateFilterSpy = jest
      .spyOn(filterActions, 'stateFilterRemoved')
      .mockImplementation(() => jest.fn());

    const newMap = {
      results: {
        state: mapResults,
      },
    };

    const newFilters = {
      state: ['FL', 'TX'],
    };

    const newView = {
      isPrintMode: false,
      tab: MODE_MAP,
      width: 1000,
    };

    renderComponent(newMap, newFilters, newView);
    expect(screen.getByTestId('tile-chart-map')).toBeInTheDocument();
    expect(screen.getByTestId('tile-chart-map')).not.toHaveClass('print');

    expect(await screen.findByText('FL')).toBeInTheDocument();
    expect(await screen.findByText('11,397')).toBeInTheDocument();

    // need to mouseEnter to initialize the toggleState handler!
    fireEvent.mouseEnter(screen.getByLabelText('1. FL, value: 11,397.'));
    fireEvent.click(screen.getByLabelText('1. FL, value: 11,397.'));
    expect(analyticsSpy).toHaveBeenCalledWith('State Event: remove', 'FL');
    expect(removeStateFilterSpy).toHaveBeenCalledWith({
      abbr: 'FL',
      name: 'Florida',
    });
  });

  it('removes per capita map filters when state filters exist', async () => {
    const analyticsSpy = jest
      .spyOn(analyticsActions, 'sendAnalyticsEvent')
      .mockImplementation(() => jest.fn());

    const removeStateFilterSpy = jest
      .spyOn(filterActions, 'stateFilterRemoved')
      .mockImplementation(() => jest.fn());

    const newMap = {
      results: {
        state: mapResults,
      },
    };

    const newFilters = {
      dataNormalization: GEO_NORM_PER1000,
      state: ['FL', 'TX'],
    };

    const newView = {
      isPrintMode: false,
      tab: MODE_MAP,
      width: 1000,
    };

    renderComponent(newMap, newFilters, newView);
    expect(screen.getByTestId('tile-chart-map')).toBeInTheDocument();
    expect(screen.getByTestId('tile-chart-map')).not.toHaveClass('print');
    expect(await screen.findByText('FL')).toBeInTheDocument();
    expect(await screen.findByText('0.56')).toBeInTheDocument();

    expect(screen.getByLabelText('31. OK, value: 535.')).toHaveClass(
      'deselected',
    );
    expect(screen.getByLabelText('1. FL, value: 11,397.')).toHaveClass(
      'selected',
    );

    // need to mouseEnter to initialize the toggleState handler!
    fireEvent.mouseEnter(screen.getByLabelText('1. FL, value: 11,397.'));
    fireEvent.click(screen.getByLabelText('1. FL, value: 11,397.'));

    expect(analyticsSpy).toHaveBeenCalledWith('State Event: remove', 'FL');
    expect(removeStateFilterSpy).toHaveBeenCalledWith({
      abbr: 'FL',
      name: 'Florida',
    });
  });
});
