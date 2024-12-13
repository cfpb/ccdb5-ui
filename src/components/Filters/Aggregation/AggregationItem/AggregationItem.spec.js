import {
  testRender as render,
  screen,
  fireEvent,
} from '../../../../testUtils/test-utils';
import { merge } from '../../../../testUtils/functionHelpers';
import * as filter from '../../../../reducers/filters/filtersSlice';
import { slugify } from '../../../../utils';
import { filtersState } from '../../../../reducers/filters/filtersSlice';
import fetchMock from 'jest-fetch-mock';
import { AggregationItem } from './AggregationItem';
import { aggResponse } from '../../../List/ListPanel/fixture';

const defaultTestProps = {
  fieldName: 'foo',
  item: {
    key: 'hole',
    value: 'som',
    doc_count: 100,
    isDisabled: false,
  },
};

const renderComponent = (props, newFiltersState) => {
  merge(newFiltersState, filtersState);

  const data = {
    filters: newFiltersState,
    routes: { queryString: '?dfsdfsa' },
  };

  render(<AggregationItem {...props} />, {
    preloadedState: data,
  });
};

describe('component::AggregationItem', () => {
  describe('initial state', () => {
    let filters;

    beforeEach(() => {
      filters = {
        issue: [1],
        timely: ['Yes'],
      };
      fetchMock.resetMocks();
      fetchMock.mockResponseOnce(JSON.stringify(aggResponse));
    });

    test('renders properly with given item key and value', async () => {
      renderComponent(defaultTestProps, filters);
      await screen.findByLabelText(defaultTestProps.item.value);
      expect(
        screen.getByLabelText(defaultTestProps.item.value),
      ).toBeInTheDocument();
      expect(
        screen.getByText(defaultTestProps.item.doc_count),
      ).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeEnabled();
    });

    test('renders properly with given item key, but no item value', async () => {
      const noItemValueProps = {
        ...defaultTestProps,
        item: { ...defaultTestProps.item, value: null },
      };
      renderComponent(noItemValueProps, filters);
      await screen.findByLabelText(defaultTestProps.item.key);
      expect(
        screen.getByLabelText(defaultTestProps.item.key),
      ).toBeInTheDocument();
      expect(
        screen.getByText(defaultTestProps.item.doc_count),
      ).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeEnabled();
    });

    test('renders properly in its disabled state', async () => {
      const disabledItemProps = {
        ...defaultTestProps,
        item: { ...defaultTestProps.item, isDisabled: true },
      };
      renderComponent(disabledItemProps, filters);
      await screen.findAllByRole('checkbox');
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    test('leaves checkbox unchecked when no filter present', async () => {
      const ownProps = {
        fieldName: 'foobar',
        item: { key: 'Yes', doc_count: 1 },
      };
      fetchMock.mockResponseOnce(JSON.stringify(aggResponse));
      renderComponent(ownProps, filters);
      await screen.findAllByRole('checkbox');
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    test('checks checkbox when fieldName key matches filters', async () => {
      const ownProps = {
        fieldName: 'timely',
        item: { key: 'Yes', doc_count: 1 },
      };
      renderComponent(ownProps, filters);
      await screen.findByRole('checkbox');
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    test('leaves checkbox unchecked when same fieldName passed with different value', async () => {
      const ownProps = {
        fieldName: 'timely',
        item: { key: 'No', doc_count: 1 },
      };
      renderComponent(ownProps, filters);
      await screen.findAllByRole('checkbox');
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    test('maps aggs & filters with fieldName', async () => {
      const ownProps = {
        fieldName: 'issue',
        item: { key: 'No Money', doc_count: 1 },
      };
      renderComponent(ownProps, filters);
      await screen.findByRole('checkbox');
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });
  });

  describe('onChange functionality', () => {
    let replaceFiltersFn, toggleFilterFn;

    beforeEach(() => {
      replaceFiltersFn = jest
        .spyOn(filter, 'filtersReplaced')
        .mockImplementation(() => jest.fn());
      toggleFilterFn = jest
        .spyOn(filter, 'filterToggled')
        .mockImplementation(() => jest.fn());
      fetchMock.resetMocks();
      fetchMock.mockResponseOnce(JSON.stringify(aggResponse));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('addFilter', () => {
      test('appends subIssue filter when not all selected', async () => {
        const ownProps = {
          fieldName: 'issue',
          item: {
            key: slugify(
              'Incorrect information on your report',
              'Information belongs to someone else',
            ),
            doc_count: 1000,
          },
        };

        renderComponent(ownProps, {});
        await screen.findByText(
          slugify(
            'Incorrect information on your report',
            'Information belongs to someone else',
          ),
        );
        fireEvent.click(
          screen.getByRole('checkbox', {
            name: slugify(
              'Incorrect information on your report',
              'Information belongs to someone else',
            ),
          }),
        );

        expect(replaceFiltersFn).toHaveBeenCalledWith('issue', [
          slugify(
            'Incorrect information on your report',
            'Information belongs to someone else',
          ),
        ]);
      });

      test('replaces subItems with parent when children are selected', async () => {
        const ownProps = {
          fieldName: 'issue',
          item: {
            key: slugify(
              'Incorrect information on your report',
              'Information belongs to someone else',
            ),
            doc_count: 1000,
          },
        };
        renderComponent(ownProps, {
          issue: [
            slugify(
              'Incorrect information on your report',
              'Account information incorrect',
            ),
            slugify(
              'Incorrect information on your report',
              'Account status incorrect',
            ),
            slugify(
              'Incorrect information on your report',
              'Personal information incorrect',
            ),
            slugify(
              'Incorrect information on your report',
              'Public record information inaccurate',
            ),
            slugify(
              'Incorrect information on your report',
              'Old information reappears or never goes away',
            ),
            slugify(
              'Incorrect information on your report',
              'Information is missing that should be on the report',
            ),
            slugify(
              'Incorrect information on your report',
              'Information is incorrect',
            ),
            slugify(
              'Incorrect information on your report',
              'Information that should be on the report is missing',
            ),
          ],
        });
        await screen.findByRole('checkbox');
        fireEvent.click(screen.getByRole('checkbox'));

        expect(replaceFiltersFn).toHaveBeenCalledWith('issue', [
          'Incorrect information on your report',
        ]);
      });

      test('handles non product & issue filters', async () => {
        const ownProps = {
          fieldName: 'fieldName',
          item: { key: 'foo', doc_count: 1000 },
        };
        renderComponent(ownProps, {});
        await screen.findByRole('checkbox');
        fireEvent.click(screen.getByRole('checkbox'));

        expect(toggleFilterFn).toHaveBeenCalled();
        expect(toggleFilterFn).toHaveBeenCalledWith('fieldName', {
          doc_count: 1000,
          key: 'foo',
        });

        expect(replaceFiltersFn).not.toHaveBeenCalled();
      });
    });

    describe('removeFilter', () => {
      beforeEach(() => {
        fetchMock.resetMocks();
        fetchMock.mockResponseOnce(JSON.stringify(aggResponse));
      });
      test('handles product/issue filters', async () => {
        const ownProps = {
          fieldName: 'issue',
          item: {
            key: 'Incorrect information on your report•Information belongs to someone else',
            doc_count: 1000,
          },
        };

        renderComponent(ownProps, {
          issue: [
            'Incorrect information on your report•Information belongs to someone else',
            'Incorrect information on your report•Account information incorrect',
            'Incorrect information on your report•Account status incorrect',
            'Incorrect information on your report•Personal information incorrect',
            'Incorrect information on your report•Public record information inaccurate',
            'Incorrect information on your report•Old information reappears or never goes away',
            'Incorrect information on your report•Information is missing that should be on the report',
            'Incorrect information on your report•Information is incorrect',
            'Incorrect information on your report•Information that should be on the report is missing',
          ],
        });
        await screen.findByRole('checkbox');
        fireEvent.click(screen.getByRole('checkbox'));

        expect(replaceFiltersFn).toHaveBeenCalledWith('issue', [
          'Incorrect information on your report•Account information incorrect',
          'Incorrect information on your report•Account status incorrect',
          'Incorrect information on your report•Personal information incorrect',
          'Incorrect information on your report•Public record information inaccurate',
          'Incorrect information on your report•Old information reappears or never goes away',
          'Incorrect information on your report•Information is missing that should be on the report',
          'Incorrect information on your report•Information is incorrect',
          'Incorrect information on your report•Information that should be on the report is missing',
        ]);
      });

      test('handles non product & issue filters', async () => {
        const ownProps = {
          fieldName: 'fieldName',
          item: { key: 'foo', doc_count: 1000 },
        };
        renderComponent(ownProps, {
          fieldName: [
            'Incorrect information on your report•Information belongs to someone else',
            'Incorrect information on your report•Account information incorrect',
            'Incorrect information on your report•Account status incorrect',
            'Incorrect information on your report•Personal information incorrect',
            'Incorrect information on your report•Public record information inaccurate',
            'Incorrect information on your report•Old information reappears or never goes away',
            'Incorrect information on your report•Information is missing that should be on the report',
            'Incorrect information on your report•Information is incorrect',
            'Incorrect information on your report•Information that should be on the report is missing',
          ],
        });
        await screen.findByRole('checkbox');
        fireEvent.click(screen.getByRole('checkbox'));

        expect(toggleFilterFn).toHaveBeenCalled();
        expect(toggleFilterFn).toHaveBeenCalledWith('fieldName', {
          doc_count: 1000,
          key: 'foo',
        });
      });
    });
  });
});
