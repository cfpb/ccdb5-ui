import React from 'react';
import { defaultAggs } from '../../reducers/aggs/aggs';
import { defaultMap } from '../../reducers/map/map';
import { defaultQuery } from '../../reducers/query/query';
import { defaultView } from '../../reducers/view/view';
import { MapPanel } from './MapPanel';
import { merge } from '../../testUtils/functionHelpers';
import {
  testRender as render,
  fireEvent,
  screen,
} from '../../testUtils/test-utils';
import { MODE_MAP } from '../../constants';
import * as viewActions from '../../actions/view';

describe('MapPanel', () => {
  const renderComponent = (
    newAggsState,
    newMapState,
    newQueryState,
    newViewState
  ) => {
    merge(newAggsState, defaultAggs);
    merge(newMapState, defaultMap);
    merge(newQueryState, defaultQuery);
    merge(newViewState, defaultView);

    const data = {
      aggs: newAggsState,
      map: newMapState,
      query: newQueryState,
      view: newViewState,
    };

    render(<MapPanel />, {
      preloadedState: data,
    });
  };

  it('renders empty state without crashing', () => {
    renderComponent({}, {}, {}, {});
    expect(screen.getByText(/Showing 0 total complaints/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Trends/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /List/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Map/ })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Close filters/ })
    ).toBeInTheDocument();
    expect(screen.getByText('Filter results by...')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Export data/ })
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

    const map = {
      error: false,
      results: {
        issue: [],
        product: [],
        state: [],
      },
    };

    const query = {
      date_received_min: new Date('7/10/2017'),
      date_received_max: new Date('7/10/2020'),
      enablePer1000: false,
      // this filter is necessary for the reducer validation
      has_narrative: true,
      mapWarningEnabled: true,
      issue: [],
      product: [],
      tab: MODE_MAP,
    };

    const view = {
      expandedRows: [],
      width: 1000,
    };

    const dismissSpy = jest
      .spyOn(viewActions, 'mapWarningDismissed')
      .mockReturnValue(jest.fn());

    renderComponent(aggs, map, query, view);
    expect(
      screen.getByText(/Showing 2 matches out of 100 total complaints/)
    ).toBeInTheDocument();

    expect(screen.getByRole('alert')).toHaveTextContent(
      '“Complaints per 1,000 population” is not available with your filter selections.'
    );

    fireEvent.click(screen.getByLabelText('Dismiss'));
    expect(dismissSpy).toHaveBeenCalledTimes(1);

    expect(
      screen.queryByRole('button', { name: /Close filters/ })
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

    const map = {
      error: true,
      results: {
        issue: [],
        product: [],
        state: [],
      },
    };

    const query = {
      date_received_min: new Date('7/10/2017'),
      date_received_max: new Date('7/10/2020'),
      enablePer1000: true,
      // this filter is necessary for the reducer validation
      has_narrative: true,
      mapWarningEnabled: false,
      issue: [],
      product: [],
      tab: MODE_MAP,
    };

    const view = {
      expandedRows: [],
      width: 1000,
    };

    renderComponent(aggs, map, query, view);
    expect(
      screen.getByText(/Showing 2 matches out of 100 total complaints/)
    ).toBeInTheDocument();

    expect(screen.getByRole('alert')).toHaveTextContent(
      'There was a problem executing your search'
    );

    expect(
      screen.queryByRole('button', { name: /Close filters/ })
    ).not.toBeInTheDocument();
  });
});
