import { generateOptions, NestedFilter } from './nested-filter';
import { slugify } from '../../../utils';
import * as filterActions from '../../../reducers/filters/filters-slice';
import { filtersState } from '../../../reducers/filters/filters-slice';
import { viewState } from '../../../reducers/view/view-slice';
import { merge } from '../../../test-utils/function-helpers';
import { screen, testRender as render } from '../../../test-utils/test-utils';
import { aggResponse } from './fixture';
import userEvent from '@testing-library/user-event';

const renderComponent = (newFiltersState, newViewState) => {
  merge(newFiltersState, filtersState);
  merge(newViewState, viewState);

  const data = {
    filters: newFiltersState,
    query: { dateLastIndexed: '2024-10-07' },
    routes: { queryString: '?fdsafsfoo' },
    view: newViewState,
  };

  render(<NestedFilter desc="Product filter" fieldName="product" />, {
    preloadedState: data,
  });
};

describe('component:NestedFilter', () => {
  const user = userEvent.setup({ delay: null });
  let filterAddedSpy;
  beforeEach(() => {
    fetchMock.resetMocks();

    filterAddedSpy = rs
      .spyOn(filterActions, 'filterAdded')
      .mockImplementation(() => rs.fn());
  });

  afterEach(() => {
    rs.resetAllMocks();
  });
  it('renders a truncated set of filter options', async () => {
    fetchMock.mockResponse(JSON.stringify(aggResponse));
    renderComponent({}, {});

    await screen.findByRole('button', {
      name: /Credit reporting, credit repair services, or other personal consumer reports/,
    });
    expect(
      screen.getByRole('button', {
        name: /Credit reporting, credit repair services, or other personal consumer reports/,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox').length).toBe(5);
    // show only 5 items
    expect(
      screen.getByRole('button', { name: '+ Show 1 more' }),
    ).toBeInTheDocument();
  });

  it('renders typeahead and options', async () => {
    fetchMock.mockResponse(JSON.stringify(aggResponse));
    renderComponent({}, {});
    await screen.findByPlaceholderText('Enter name of product');
    const input = screen.getByPlaceholderText('Enter name of product');
    await user.clear(input);
    await user.type(input, 'Credit');
    await screen.findAllByRole('option', { name: /Credit/ });
    expect(
      screen.getByRole('option', {
        name: /Other personal consumer report/,
      }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole('option', {
        name: /Credit reporting, credit repair services, or other personal consumer reports•Other personal consumer report/,
      }),
    );

    expect(filterAddedSpy).toHaveBeenCalled();
  });
});

describe('generateOptions', () => {
  const aggsProduct = aggResponse.aggregations.product.product.buckets;
  describe('sorting', () => {
    it('places selections ahead of unselected', () => {
      const selected = [
        'Credit reporting, credit repair services, or other personal consumer reports',
        slugify(
          'Credit reporting, credit repair services, or other personal consumer reports',
          'Other personal consumer report',
        ),
        'Credit card',
      ];

      const options = generateOptions(aggsProduct, selected, 'product');
      expect(options[1]).toEqual(aggsProduct[5]);
    });

    it('treats child selections as parent selections', () => {
      const selected = [slugify('Mortgage', 'Conventional home mortgage')];
      const options = generateOptions(aggsProduct, selected, 'product');
      expect(options[0]).toEqual(aggsProduct[1]);
    });
  });
});
