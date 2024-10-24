import React from 'react';
import { aggsState } from '../../reducers/aggs/aggsSlice';
import { filtersState } from '../../reducers/filters/filtersSlice';
import { mapState } from '../../reducers/map/mapSlice';
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

describe('MapPanel', () => {
  const renderComponent = (
    newAggsState,
    newFiltersState,
    newMapState,
    newQueryState,
    newViewState,
  ) => {
    merge(newAggsState, aggsState);
    merge(newFiltersState, filtersState);
    merge(newMapState, mapState);
    merge(newQueryState, queryState);
    merge(newViewState, viewState);

    const data = {
      aggs: newAggsState,
      filters: newFiltersState,
      map: newMapState,
      query: newQueryState,
      view: newViewState,
    };

    render(<MapPanel />, {
      preloadedState: data,
    });
  };

  it('renders empty state without crashing', () => {
    renderComponent({}, {}, {}, {}, {});
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

  it('renders warning', () => {
    const items = [
      { key: 'CA', doc_count: 62519 },
      { key: 'FL', doc_count: 47358 },
    ];
    const aggs = {
      doc_count: 100,
      total: items.length,
    };

    const filters = {
      enablePer1000: false,
      has_narrative: true,
      mapWarningEnabled: true,
    };

    const map = {
      error: false,
      results: {
        product: [],
        state: [],
      },
    };

    const query = {
      date_received_min: new Date('7/10/2017'),
      date_received_max: new Date('7/10/2020'),
    };

    const view = {
      expandedRows: [],
      tab: MODE_MAP,
      width: 1000,
    };

    const dismissSpy = jest
      .spyOn(viewActions, 'mapWarningDismissed')
      .mockReturnValue(jest.fn());

    renderComponent(aggs, filters, map, query, view);
    expect(
      screen.getByText(/Showing 2 matches out of 100 total complaints/),
    ).toBeInTheDocument();

    expect(screen.getByRole('alert')).toHaveTextContent(
      '“Complaints per 1,000 population” is not available with your filter selections.',
    );

    fireEvent.click(screen.getByLabelText('Dismiss'));
    expect(dismissSpy).toHaveBeenCalledTimes(1);

    expect(
      screen.queryByRole('button', { name: /Close filters/ }),
    ).not.toBeInTheDocument();

    expect(document.getElementById('tile-chart-map')).toBeInTheDocument();
    expect(document.getElementById('row-chart-product')).toBeInTheDocument();
  });

  it('renders error', () => {
    const items = [
      { key: 'CA', doc_count: 62519 },
      { key: 'FL', doc_count: 47358 },
    ];
    const aggs = {
      doc_count: 100,
      total: items.length,
    };

    const filters = {
      enablePer1000: true,
      has_narrative: true,
      mapWarningEnabled: false,
    };

    const map = {
      error: true,
      results: {
        product: [],
        state: [],
      },
    };

    const query = {
      date_received_min: new Date('7/10/2017'),
      date_received_max: new Date('7/10/2020'),
    };

    const view = {
      expandedRows: [],
      tab: MODE_MAP,
      width: 1000,
    };

    renderComponent(aggs, filters, map, query, view);
    expect(
      screen.getByText(/Showing 2 matches out of 100 total complaints/),
    ).toBeInTheDocument();

    expect(screen.getByRole('alert')).toHaveTextContent(
      'There was a problem executing your search',
    );

    expect(
      screen.queryByRole('button', { name: /Close filters/ }),
    ).not.toBeInTheDocument();
  });
});
