import { generateOptions, Product } from './Product';
import { slugify } from '../../../utils';
import fetchMock from 'jest-fetch-mock';
import { filtersState } from '../../../reducers/filters/filtersSlice';
import { trendsState } from '../../../reducers/trends/trendsSlice';
import { viewState } from '../../../reducers/view/viewSlice';
import { merge } from '../../../testUtils/functionHelpers';
import { screen, testRender as render } from '../../../testUtils/test-utils';
import { MODE_TRENDS } from '../../../constants';
import { aggResponse } from './fixture';

const renderComponent = (newFiltersState, newTrendsState, newViewState) => {
  merge(newFiltersState, filtersState);
  merge(newTrendsState, trendsState);
  merge(newViewState, viewState);

  const data = {
    filters: newFiltersState,
    routes: { queryString: '?fdsafsfoo' },
    view: newViewState,
  };

  render(<Product />, { preloadedState: data });
};

describe('component:Product', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });
  it('renders a truncated set of filter options', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(aggResponse));
    renderComponent({}, {}, {});

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

      const options = generateOptions(aggsProduct, selected, '', '', '');
      expect(options[1]).toEqual(aggsProduct[5]);
    });

    it('treats child selections as parent selections', () => {
      const selected = [slugify('Mortgage', 'Conventional home mortgage')];
      const options = generateOptions(aggsProduct, selected, '', '', '');
      expect(options[0]).toEqual(aggsProduct[1]);
    });
  });

  describe('focus logic', () => {
    it('disable the non-focus options', () => {
      const focus = 'Mortgage';
      const lens = 'Product';
      const filtersProduct = ['Mortgage'];
      const options = generateOptions(
        aggsProduct,
        filtersProduct,
        focus,
        lens,
        MODE_TRENDS,
      );
      expect(options).toEqual([
        {
          'sub_product.raw': {
            buckets: [
              {
                key: 'Conventional home mortgage',
                doc_count: 652,
                isDisabled: false,
              },
              {
                key: 'Conventional fixed mortgage',
                doc_count: 612,
                isDisabled: false,
              },
            ],
          },
          key: 'Mortgage',
          doc_count: 2299,
          isDisabled: false,
        },
        {
          'sub_product.raw': {
            buckets: [
              {
                key: 'Credit reporting',
                doc_count: 3200,
                isDisabled: true,
              },
              {
                key: 'Other personal consumer report',
                doc_count: 67,
                isDisabled: true,
              },
              {
                key: 'Credit repair services',
                doc_count: 10,
                isDisabled: true,
              },
            ],
          },
          key: 'Credit reporting, credit repair services, or other personal consumer reports',
          doc_count: 3277,
          isDisabled: true,
        },
        {
          'sub_product.raw': { buckets: [] },
          key: 'Credit reporting',
          doc_count: 1052,
          isDisabled: true,
        },
        {
          'sub_product.raw': { buckets: [] },
          key: 'Student loan',
          doc_count: 959,
          isDisabled: true,
        },
        {
          'sub_product.raw': { buckets: [] },
          key: 'Credit card or prepaid card',
          doc_count: 836,
          isDisabled: true,
        },
        {
          'sub_product.raw': { buckets: [] },
          key: 'Credit card',
          doc_count: 652,
          isDisabled: true,
        },
      ]);
    });
    it('does not disable items when lens not Product', () => {
      const queryFocus = 'Mortgage';
      const queryLens = 'Company';
      const filtersProduct = ['Mortgage'];
      const options = generateOptions(
        aggsProduct,
        filtersProduct,
        queryFocus,
        queryLens,
        MODE_TRENDS,
      );
      expect(options).toEqual([
        {
          'sub_product.raw': {
            buckets: [
              {
                key: 'Conventional home mortgage',
                doc_count: 652,
                isDisabled: false,
              },
              {
                key: 'Conventional fixed mortgage',
                doc_count: 612,
                isDisabled: false,
              },
            ],
          },
          key: 'Mortgage',
          doc_count: 2299,
          isDisabled: false,
        },
        {
          'sub_product.raw': {
            buckets: [
              {
                key: 'Credit reporting',
                doc_count: 3200,
                isDisabled: false,
              },
              {
                key: 'Other personal consumer report',
                doc_count: 67,
                isDisabled: false,
              },
              {
                key: 'Credit repair services',
                doc_count: 10,
                isDisabled: false,
              },
            ],
          },
          key: 'Credit reporting, credit repair services, or other personal consumer reports',
          doc_count: 3277,
          isDisabled: false,
        },
        {
          'sub_product.raw': { buckets: [] },
          key: 'Credit reporting',
          doc_count: 1052,
          isDisabled: false,
        },
        {
          'sub_product.raw': { buckets: [] },
          key: 'Student loan',
          doc_count: 959,
          isDisabled: false,
        },
        {
          'sub_product.raw': { buckets: [] },
          key: 'Credit card or prepaid card',
          doc_count: 836,
          isDisabled: false,
        },
        {
          'sub_product.raw': { buckets: [] },
          key: 'Credit card',
          doc_count: 652,
          isDisabled: false,
        },
      ]);
    });
  });
});
