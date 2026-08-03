import { ActionBar } from './action-bar';
import { viewState } from '../../reducers/view/view-slice';
import { merge } from '../../test-utils/function-helpers';
import { screen, testRender as render } from '../../test-utils/test-utils';
import { waitFor } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import { aggResponse } from '../list/list-panel/fixture';

describe('ActionBar', () => {
  const renderComponent = (newViewState) => {
    merge(newViewState, viewState);

    const data = {
      query: { dateLastIndexed: '2020-05-05' },
      routes: { queryString: '?sdafds' },
      view: newViewState,
    };

    render(<ActionBar />, {
      preloadedState: data,
    });
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('shows loading then success alert as aggregations resolve', async () => {
    const { promise, resolve } = Promise.withResolvers();
    fetchMock.mockResponseOnce(() => promise);

    renderComponent({ tab: 'Map' });

    expect(screen.getByText('Loading complaint counts…')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByLabelText('loading icon')).toBeInTheDocument();
    });
    expect(screen.queryByLabelText('success icon')).not.toBeInTheDocument();

    resolve({
      body: JSON.stringify(aggResponse),
      init: { status: 200 },
    });

    await screen.findByText(
      'Showing 4,303,365 matching results out of 6,638,372 total complaints',
    );
    await waitFor(() => {
      expect(screen.getByLabelText('success icon')).toBeInTheDocument();
    });
  });
});
