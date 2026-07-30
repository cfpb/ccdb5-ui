import {
  screen,
  testRender as render,
  waitFor,
} from '../../../test-utils/test-utils';
import fetchMock from 'jest-fetch-mock';
import { merge } from '../../../test-utils/function-helpers';
import userEvent from '@testing-library/user-event';
import { FederalState } from './federal-state';
import * as filterActions from '../../../reducers/filters/filters-slice';
import { filtersState } from '../../../reducers/filters/filters-slice';
import { cloneDeep } from 'lodash';
import { aggResponse } from '../../list/list-panel/fixture';

fetchMock.enableMocks();

const renderComponent = (newFiltersState) => {
  merge(newFiltersState, filtersState);
  const data = {
    filters: newFiltersState,
    query: { dateLastIndexed: '2025-01-01' },
    routes: { queryString: '?foo=bar' },
  };

  render(<FederalState />, {
    preloadedState: data,
  });
};

describe('FederalState', () => {
  let statesResponse;
  beforeEach(() => {
    fetchMock.resetMocks();
    statesResponse = cloneDeep(aggResponse);
    statesResponse.aggregations.state = {
      doc_count: 4_303_365,
      state: {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [],
      },
    };
  });

  const user = userEvent.setup({ delay: null });

  test('Options appear when user types and dispatches multipleFiltersAdded on selection', async () => {
    const multipleFiltersAddedSpy = jest
      .spyOn(filterActions, 'multipleFiltersAdded')
      .mockImplementation(() => jest.fn());

    fetchMock.mockResponse(JSON.stringify(statesResponse));
    renderComponent({ state: ['TX'] });
    // test presence of zero count filters
    await screen.findByLabelText('TX');
    const input = screen.getByPlaceholderText(
      'Enter state name or abbreviation',
    );
    await user.type(input, 'Ma');
    const option = await screen.findByRole('option', {
      name: /(MD)/,
    });
    await user.click(option);

    await waitFor(() =>
      expect(multipleFiltersAddedSpy).toHaveBeenCalledWith('state', ['MD']),
    );
  });

  test('No matches found appears if user types non-existing option', async () => {
    render(<FederalState />);
    const input = screen.getByPlaceholderText(
      'Enter state name or abbreviation',
    );
    await user.type(input, 'Apples');

    expect(await screen.findByText('No matches found.')).toBeInTheDocument();
  });

  test('Option list disappears when user removes text', async () => {
    render(<FederalState />);
    const input = screen.getByPlaceholderText(
      'Enter state name or abbreviation',
    );
    await user.type(input, 'Ma');
    const option = await screen.findByRole('option', {
      name: /(MD)/,
    });
    await user.clear(input);

    expect(option).not.toBeInTheDocument();
  });
});
