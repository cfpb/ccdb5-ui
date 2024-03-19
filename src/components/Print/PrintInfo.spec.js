import { PrintInfo } from './PrintInfo';
import React from 'react';
import { aggsState } from '../../reducers/aggs/aggsSlice';
import { queryState } from '../../reducers/query/querySlice';
import { viewState } from '../../reducers/view/viewSlice';
import { merge } from '../../testUtils/functionHelpers';
import { testRender as render, screen } from '../../testUtils/test-utils';

describe('PrintInfo', () => {
  const renderComponent = (newAggsState, newQueryState, newViewState) => {
    merge(newAggsState, aggsState);
    merge(newQueryState, queryState);
    merge(newViewState, viewState);

    const data = {
      aggs: newAggsState,
      query: newQueryState,
      view: newViewState,
    };
    render(<PrintInfo />, {
      preloadedState: data,
    });
  };

  it('renders default state', () => {
    renderComponent({}, {}, {});
    expect(screen.queryByText('Dates:')).toBeNull();
    expect(screen.queryByText('5/5/2017 - 5/5/2020')).toBeNull();
  });

  it('renders filtered complaints', () => {
    const newAggs = {
      doc_count: 4000,
      total: 1000,
    };

    const newQuery = {
      date_received_max: new Date('2020-03-05T05:00:00.000Z'),
      date_received_min: new Date('2017-03-05T05:00:00.000Z'),
      searchText: 'foobar',
    };

    const newView = {
      isPrintMode: true,
    };

    renderComponent(newAggs, newQuery, newView);
    expect(screen.getByText('Dates:')).toBeInTheDocument();
    expect(screen.getByText('3/5/2017 - 3/5/2020')).toBeInTheDocument();
    expect(screen.getByText('foobar')).toBeInTheDocument();
    expect(screen.getByText(/Showing/)).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText(/out of/)).toBeInTheDocument();
    expect(screen.getByText('4,000')).toBeInTheDocument();
    expect(screen.getByText(/total complaints/)).toBeInTheDocument();
  });
});
