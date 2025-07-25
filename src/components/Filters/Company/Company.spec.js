import { merge } from '../../../testUtils/functionHelpers';
import { filtersState } from '../../../reducers/filters/filtersSlice';
import { queryState } from '../../../reducers/query/querySlice';
import { Company } from './Company';
import { screen, testRender as render } from '../../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import fetchMock from 'jest-fetch-mock';
import { aggResponse } from './fixture';
import { trendsState } from '../../../reducers/trends/trendsSlice';

const renderComponent = (newFiltersState, newQueryState, newTrendsState) => {
  merge(newFiltersState, filtersState);
  merge(newQueryState, queryState);
  merge(newTrendsState, trendsState);

  const data = {
    filters: newFiltersState,
    routes: { queryString: '?fdsafsfoo' },
    query: newQueryState,
    trends: newTrendsState,
  };

  render(<Company />, {
    preloadedState: data,
  });
};

fetchMock.enableMocks();

describe('component::Company', () => {
  const user = userEvent.setup({ delay: null });

  beforeEach(() => {
    fetchMock.resetMocks();
  });
  it('renders filters', async () => {
    const filters = {
      company: ['Monocle Popper Inc'],
    };

    fetchMock.mockResponse((req) => {
      if (req.url.indexOf('_suggest') > -1) {
        return Promise.resolve({
          body: JSON.stringify(['Safe-T Deposits LLC']),
        });
      } else {
        return Promise.resolve({
          body: JSON.stringify(aggResponse),
        });
      }
    });

    renderComponent(filters, { dateLastIndexed: '2024-10-07' }, {});
    await screen.findByRole('checkbox', { name: 'Monocle Popper Inc' });
    expect(
      screen.getByText('The complaint is about this company.'),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter company name'),
    ).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText('Enter company name'), 'Safe');
    fetchMock.mockResponse(JSON.stringify(['Safe-T Deposits LLC']));
    expect(screen.getByPlaceholderText('Enter company name')).toHaveValue(
      'Safe',
    );
    expect(
      screen.getByRole('checkbox', { name: 'Monocle Popper Inc' }),
    ).toBeInTheDocument();

    // test the selection of the typed items
    expect(
      await screen.findByRole('option', { name: 'Safe-T Deposits LLC' }),
    ).toBeInTheDocument();
  });
});
