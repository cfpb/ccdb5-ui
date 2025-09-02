import {
  screen,
  testRender as render,
  waitFor,
} from '../../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import fetchMock from 'jest-fetch-mock';
import * as filterActions from '../../../reducers/filters/filtersSlice';
import { filtersState } from '../../../reducers/filters/filtersSlice';
import { ZipCode } from './ZipCode';
import { cloneDeep, merge } from 'lodash';
import { aggResponse } from '../../List/ListPanel/fixture';

fetchMock.enableMocks();

const renderComponent = (newFiltersState) => {
  merge(newFiltersState, filtersState);
  const data = {
    filters: newFiltersState,
    query: { dateLastIndexed: '2025-01-01' },
    routes: { queryString: '?foo=bar' },
  };

  render(<ZipCode />, {
    preloadedState: data,
  });
};

describe('ZipCode', () => {
  let zipAggsResponse;
  beforeEach(() => {
    fetchMock.resetMocks();
    zipAggsResponse = cloneDeep(aggResponse);
    zipAggsResponse.aggregations.zip_code = {
      doc_count: 4303365,
      zip_code: {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [],
      },
    };
  });

  const user = userEvent.setup({ delay: null });

  test('Options appear when user types and dispatches addMultipleFilters on selection', async () => {
    fetchMock.mockResponse((req) => {
      if (req.url.indexOf('_suggest_zip') > -1) {
        return Promise.resolve({
          body: JSON.stringify(['22191', '22202', '22031', '22203', '22204']),
        });
      } else {
        return Promise.resolve({
          body: JSON.stringify(zipAggsResponse),
        });
      }
    });

    const multipleFiltersAddedSpy = jest
      .spyOn(filterActions, 'multipleFiltersAdded')
      .mockImplementation(() => jest.fn());

    renderComponent({ zip_code: ['90210'] });
    // test presence of zero count filters
    await screen.findByLabelText('90210');
    expect(screen.getByRole('checkbox', { name: '90210' })).toBeInTheDocument();
    const input = screen.getByPlaceholderText('Enter ZIP code');
    await user.type(input, '22');
    const option = await screen.findByRole('option', {
      name: /22191/,
    });

    await user.click(option);

    await waitFor(() =>
      expect(multipleFiltersAddedSpy).toHaveBeenCalledWith('zip_code', [
        '22191',
      ]),
    );
  });
});
