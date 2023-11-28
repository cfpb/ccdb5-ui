import React from 'react';
import { MapToolbar } from './MapToolbar';
import { merge } from '../../testUtils/functionHelpers';
import { queryState } from '../../reducers/query/query';
import {
  testRender as render,
  screen,
  fireEvent,
} from '../../testUtils/test-utils';
import * as mapActions from '../../reducers/query/query';

describe('MapToolbar', () => {
  const renderComponent = (newQueryState) => {
    merge(newQueryState, queryState);

    const data = {
      query: newQueryState,
    };

    render(<MapToolbar />, {
      preloadedState: data,
    });
  };
  it('renders no states filter without crashing', () => {
    renderComponent({});
    expect(screen.getByText('United States of America')).toBeInTheDocument();
  });

  it('renders filtered states and clears filters', () => {
    const clearStateFilterSpy = jest
      .spyOn(mapActions, 'clearStateFilter')
      .mockImplementation(() => jest.fn());

    renderComponent({
      state: ['FL', 'TX'],
    });
    expect(screen.getByText('Florida, Texas')).toBeInTheDocument();
    expect(screen.getByLabelText('Clear all map filters')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Clear'));
    expect(clearStateFilterSpy).toHaveBeenCalledTimes(1);
  });

  it('renders filtered states and goes to list', () => {
    const showStateComplaintsSpy = jest
      .spyOn(mapActions, 'showStateComplaints')
      .mockImplementation(() => jest.fn());

    renderComponent({
      state: ['FL', 'TX'],
    });
    expect(screen.getByText('Florida, Texas')).toBeInTheDocument();
    fireEvent.click(screen.getByText('View complaints for filtered states'));
    expect(showStateComplaintsSpy).toHaveBeenCalledTimes(1);
  });
});
