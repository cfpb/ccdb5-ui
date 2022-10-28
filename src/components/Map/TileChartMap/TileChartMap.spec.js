import { TileChartMap } from './TileChartMap';
import React from 'react';
import { testRender as render, screen } from '../../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import { merge } from '../../../testUtils/functionHelpers';
import { defaultMap } from '../../../reducers/map/map';
import { defaultQuery } from '../../../reducers/query/query';
import { defaultView } from '../../../reducers/view/view';
import { mapResults } from './__fixtures__/mapResults';
import { waitFor } from '@testing-library/react';
import { GEO_NORM_PER1000 } from '../../../constants';
import * as analyticsActions from '../../../utils';
import * as mapActions from '../../../actions/map';

describe('TileChartMap', () => {
  const renderComponent = (newMapState, newQueryState, newViewState) => {
    merge(newMapState, defaultMap);
    merge(newQueryState, defaultQuery);
    merge(newViewState, defaultView);

    const data = {
      map: newMapState,
      query: newQueryState,
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
      screen.getByText('Map of unspecified region with 1 data series.')
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
      .spyOn(mapActions, 'addStateFilter')
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
    await waitFor(() => {
      expect(screen.getByText('FL')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('11,397')).toBeInTheDocument();
    });

    userEvent.click(screen.getByLabelText('1. FL, value: 11,397.'));
    await waitFor(() => {
      expect(analyticsSpy).toHaveBeenCalledWith('State Event: add', 'FL');
    });

    await waitFor(() => {
      expect(addStateFilterSpy).toHaveBeenCalledWith({
        abbr: 'FL',
        name: 'Florida',
      });
    });
  });

  it('renders map with per capita values', async () => {
    const analyticsSpy = jest
      .spyOn(analyticsActions, 'sendAnalyticsEvent')
      .mockImplementation(() => jest.fn());

    const addStateFilterSpy = jest
      .spyOn(mapActions, 'addStateFilter')
      .mockImplementation(() => jest.fn());

    const newMap = {
      results: {
        state: mapResults,
      },
    };

    const newQuery = {
      dataNormalization: GEO_NORM_PER1000,
    };

    const newView = {
      isPrintMode: false,
      width: 1000,
    };

    renderComponent(newMap, newQuery, newView);
    expect(screen.getByTestId('tile-chart-map')).toBeInTheDocument();
    expect(screen.getByTestId('tile-chart-map')).not.toHaveClass('print');

    await waitFor(() => {
      expect(screen.getByText('Complaints per 1,000')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('FL')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('0.56')).toBeInTheDocument();
    });

    // tooltip check
    userEvent.hover(screen.getByLabelText('1. FL, value: 11,397.'));
    await waitFor(() => {
      expect(
        screen.getByText('Product with highest complaint volume')
      ).toBeVisible();
    });

    userEvent.click(screen.getByLabelText('1. FL, value: 11,397.'));
    await waitFor(() => {
      expect(analyticsSpy).toHaveBeenCalledWith('State Event: add', 'FL');
    });

    await waitFor(() => {
      expect(addStateFilterSpy).toHaveBeenCalledWith({
        abbr: 'FL',
        name: 'Florida',
      });
    });
  });

  it('removes map filters when state filters exist', async () => {
    const analyticsSpy = jest
      .spyOn(analyticsActions, 'sendAnalyticsEvent')
      .mockImplementation(() => jest.fn());

    const removeStateFilterSpy = jest
      .spyOn(mapActions, 'removeStateFilter')
      .mockImplementation(() => jest.fn());

    const newMap = {
      results: {
        state: mapResults,
      },
    };

    const newQuery = {
      state: ['FL', 'TX'],
    };

    const newView = {
      isPrintMode: false,
      width: 1000,
    };

    renderComponent(newMap, newQuery, newView);
    expect(screen.getByTestId('tile-chart-map')).toBeInTheDocument();
    expect(screen.getByTestId('tile-chart-map')).not.toHaveClass('print');
    await waitFor(() => {
      expect(screen.getByText('FL')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('11,397')).toBeInTheDocument();
    });

    userEvent.click(screen.getByLabelText('1. FL, value: 11,397.'));
    await waitFor(() => {
      expect(analyticsSpy).toHaveBeenCalledWith('State Event: remove', 'FL');
    });

    await waitFor(() => {
      expect(removeStateFilterSpy).toHaveBeenCalledWith({
        abbr: 'FL',
        name: 'Florida',
      });
    });
  });

  it('removes per capita map filters when state filters exist', async () => {
    const analyticsSpy = jest
      .spyOn(analyticsActions, 'sendAnalyticsEvent')
      .mockImplementation(() => jest.fn());

    const removeStateFilterSpy = jest
      .spyOn(mapActions, 'removeStateFilter')
      .mockImplementation(() => jest.fn());

    const newMap = {
      results: {
        state: mapResults,
      },
    };

    const newQuery = {
      dataNormalization: GEO_NORM_PER1000,
      state: ['FL', 'TX'],
    };

    const newView = {
      isPrintMode: false,
      width: 1000,
    };

    renderComponent(newMap, newQuery, newView);
    expect(screen.getByTestId('tile-chart-map')).toBeInTheDocument();
    expect(screen.getByTestId('tile-chart-map')).not.toHaveClass('print');
    await waitFor(() => {
      expect(screen.getByText('FL')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('0.56')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('31. OK, value: 535.')).toHaveClass(
      'deselected'
    );
    expect(screen.getByLabelText('1. FL, value: 11,397.')).toHaveClass(
      'selected'
    );

    userEvent.click(screen.getByLabelText('1. FL, value: 11,397.'));
    await waitFor(() => {
      expect(analyticsSpy).toHaveBeenCalledWith('State Event: remove', 'FL');
    });

    await waitFor(() => {
      expect(removeStateFilterSpy).toHaveBeenCalledWith({
        abbr: 'FL',
        name: 'Florida',
      });
    });
  });
});
