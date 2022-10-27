import { TileChartMap } from './TileChartMap';
import React from 'react';
import {
  testRender as render,
  // fireEvent,
  screen,
} from '../../../testUtils/test-utils';
import { merge } from '../../../testUtils/functionHelpers';
import { defaultMap } from '../../../reducers/map/map';
import { defaultQuery } from '../../../reducers/query/query';
import { defaultView } from '../../../reducers/view/view';
import { mapResults } from './__fixtures__/mapResults';
import { waitFor } from '@testing-library/react';
import { GEO_NORM_PER1000 } from '../../../constants';
import * as analyticsActions from '../../../utils';
import userEvent from '@testing-library/user-event';

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

    const newMap = {
      results: {
        state: mapResults,
      },
    };

    const newView = {
      isPrintMode: false,
      width: 1000,
    };

    const user = userEvent.setup();

    renderComponent(newMap, {}, newView);
    expect(screen.getByTestId('tile-chart-map')).toBeInTheDocument();
    expect(screen.getByTestId('tile-chart-map')).not.toHaveClass('print');
    await waitFor(() => {
      expect(screen.getByText('FL')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('11,397')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByLabelText('1. FL, value: 11,397.')
      ).toBeInTheDocument();
    });

    user.click(screen.getByLabelText('1. FL, value: 11,397.'));
    await waitFor(() => {
      expect(analyticsSpy).toHaveBeenCalled();
    });
  });

  it('renders map with per capita values', async () => {
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
      expect(screen.getByText('FL')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('0.56')).toBeInTheDocument();
    });
  });
});
