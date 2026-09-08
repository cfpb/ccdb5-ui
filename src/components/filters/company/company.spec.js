import { merge } from '../../../test-utils/function-helpers';
import { filtersState } from '../../../reducers/filters/filters-slice';
import { queryState } from '../../../reducers/query/query-slice';
import { Company } from './company';
import { screen, testRender as render } from '../../../test-utils/test-utils';
import userEvent from '@testing-library/user-event';
import { aggResponse } from './fixture';

const renderComponent = (newFiltersState, newQueryState) => {
  merge(newFiltersState, filtersState);
  merge(newQueryState, queryState);

  const data = {
    filters: newFiltersState,
    routes: { queryString: '?fdsafsfoo' },
    query: newQueryState,
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
      return req.url.includes('_suggest')
        ? Promise.resolve({
            body: JSON.stringify(['Safe-T Deposits LLC']),
          })
        : Promise.resolve({
            body: JSON.stringify(aggResponse),
          });
    });

    renderComponent(filters, { dateLastIndexed: '2024-10-07' });
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
