import { testRender as render, screen } from '../../../../testUtils/test-utils';
import { merge } from '../../../../testUtils/functionHelpers';
import userEvent from '@testing-library/user-event';
import * as filter from '../../../../actions/filter';
import * as utils from '../../../../utils';
import { slugify } from '../../../../utils';
import { defaultAggs } from '../../../../reducers/aggs/aggsSlice';
import { defaultQuery } from '../../../../reducers/query/query';
import { AggregationItem } from './AggregationItem';

const defaultTestProps = {
  fieldName: 'foo',
  item: {
    key: 'hole',
    value: 'som',
    doc_count: 100,
    isDisabled: false,
  },
};

const renderComponent = (props, newAggsState, newQueryState) => {
  merge(newAggsState, defaultAggs);
  merge(newQueryState, defaultQuery);

  const data = {
    aggs: newAggsState,
    query: newQueryState,
  };

  render(<AggregationItem {...props} />, {
    preloadedState: data,
  });
};

describe('component::AggregationItem', () => {
  const user = userEvent.setup({ delay: null });

  describe('initial state', () => {
    let aggs, query;

    beforeEach(() => {
      aggs = {
        issue: [1, 2, 3],
        product: ['foo', 'bar'],
      };

      query = {
        issue: [1],
        timely: ['Yes'],
      };
    });

    test('renders properly with given item key and value', () => {
      renderComponent(defaultTestProps, aggs, query);

      expect(
        screen.getByLabelText(defaultTestProps.item.value),
      ).toBeInTheDocument();
      expect(
        screen.getByText(defaultTestProps.item.doc_count),
      ).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeEnabled();
    });

    test('renders properly with given item key, but no item value', () => {
      const noItemValueProps = {
        ...defaultTestProps,
        item: { ...defaultTestProps.item, value: null },
      };

      renderComponent(noItemValueProps, aggs, query);

      expect(
        screen.getByLabelText(defaultTestProps.item.key),
      ).toBeInTheDocument();
      expect(
        screen.getByText(defaultTestProps.item.doc_count),
      ).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeEnabled();
    });

    test('renders properly in its disabled state', () => {
      const disabledItemProps = {
        ...defaultTestProps,
        item: { ...defaultTestProps.item, isDisabled: true },
      };

      renderComponent(disabledItemProps, aggs, query);

      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    test('leaves checkbox unchecked when no filter present', () => {
      const ownProps = {
        fieldName: 'foobar',
        item: { key: 'Yes', doc_count: 1 },
      };

      renderComponent(ownProps, aggs, query);

      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    test('checks checkbox when fieldName key matches query', () => {
      const ownProps = {
        fieldName: 'timely',
        item: { key: 'Yes', doc_count: 1 },
      };

      renderComponent(ownProps, aggs, query);

      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    test('leaves checkbox unchecked when same fieldName passed with different value', () => {
      const ownProps = {
        fieldName: 'timely',
        item: { key: 'No', doc_count: 1 },
      };

      renderComponent(ownProps, aggs, query);

      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    test('maps aggs & filters with fieldName', () => {
      const ownProps = {
        fieldName: 'issue',
        item: { key: 'No Money', doc_count: 1 },
      };

      renderComponent(ownProps, aggs, query);

      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });
  });

  describe('onChange functionality', () => {
    let replaceFiltersFn, toggleFilterFn, coalesceFn;

    beforeEach(() => {
      replaceFiltersFn = jest.spyOn(filter, 'replaceFilters');
      toggleFilterFn = jest.spyOn(filter, 'toggleFilter');
      coalesceFn = jest.spyOn(utils, 'coalesce');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('addFilter', () => {
      test('appends subIssue filter when not all selected', async () => {
        const ownProps = {
          fieldName: 'issue',
          item: {
            key: slugify('a', 'b'),
            doc_count: 1000,
          },
        };

        const aggs = [
          {
            key: 'a',
            doc_count: 1,
            'sub_issue.raw': {
              buckets: [{ key: 'b' }, { key: 'c' }, { key: 'd' }],
            },
          },
        ];

        const filters = ['f', 'g', 'h', slugify('a', 'd')];

        coalesceFn.mockReturnValueOnce(aggs).mockReturnValueOnce(filters);

        renderComponent(ownProps, {}, {});

        await user.click(screen.getByRole('checkbox'));

        expect(replaceFiltersFn).toHaveBeenCalled();
        expect(replaceFiltersFn).toHaveReturnedWith({
          filterName: 'issue',
          requery: 'REQUERY_ALWAYS',
          type: 'FILTER_REPLACED',
          values: ['f', 'g', 'h', slugify('a', 'd'), slugify('a', 'b')],
        });

        expect(toggleFilterFn).not.toHaveBeenCalled();
      });

      test('replaces subItems with parent when children are selected', async () => {
        const ownProps = {
          fieldName: 'issue',
          item: {
            key: slugify('a', 'b'),
            doc_count: 1000,
          },
        };

        const aggs = [
          {
            key: 'a',
            doc_count: 1,
            'sub_issue.raw': {
              buckets: [{ key: 'b' }, { key: 'c' }, { key: 'd' }],
            },
          },
        ];

        const filters = ['f', 'g', 'h', slugify('a', 'c'), slugify('a', 'd')];

        coalesceFn.mockReturnValueOnce(aggs).mockReturnValueOnce(filters);

        renderComponent(ownProps, {}, {});

        await user.click(screen.getByRole('checkbox'));

        expect(replaceFiltersFn).toHaveBeenCalled();
        expect(replaceFiltersFn).toHaveReturnedWith({
          filterName: 'issue',
          requery: 'REQUERY_ALWAYS',
          type: 'FILTER_REPLACED',
          values: ['f', 'g', 'h', 'a'],
        });

        expect(toggleFilterFn).not.toHaveBeenCalled();
      });

      test('handles non product & issue filters', async () => {
        const ownProps = {
          fieldName: 'fieldName',
          item: { key: 'foo', doc_count: 1000 },
        };

        const aggs = {};
        const filters = [];

        coalesceFn.mockReturnValueOnce(aggs).mockReturnValueOnce(filters);

        renderComponent(ownProps, {}, {});

        await user.click(screen.getByRole('checkbox'));

        expect(toggleFilterFn).toHaveBeenCalled();
        expect(toggleFilterFn).toHaveReturnedWith({
          filterName: 'fieldName',
          filterValue: {
            doc_count: 1000,
            key: 'foo',
          },
          requery: 'REQUERY_ALWAYS',
          type: 'FILTER_CHANGED',
        });

        expect(replaceFiltersFn).not.toHaveBeenCalled();
      });
    });

    describe('removeFilter', () => {
      test('handles product/issue filters', async () => {
        const ownProps = {
          fieldName: 'issue',
          item: { key: 'foo', doc_count: 1000 },
        };

        const aggs = [
          {
            key: 'foo',
            doc_count: 1,
            'sub_issue.raw': {
              buckets: [],
            },
          },
        ];
        const filters = ['foo'];

        coalesceFn.mockReturnValueOnce(aggs).mockReturnValueOnce(filters);

        renderComponent(ownProps, {}, {});

        await user.click(screen.getByRole('checkbox'));

        expect(replaceFiltersFn).toHaveBeenCalled();
        expect(replaceFiltersFn).toHaveReturnedWith({
          filterName: 'issue',
          requery: 'REQUERY_ALWAYS',
          type: 'FILTER_REPLACED',
          values: [],
        });

        expect(toggleFilterFn).not.toHaveBeenCalled();
      });

      test('handles non product & issue filters', async () => {
        const ownProps = {
          fieldName: 'fieldName',
          item: { key: 'foo', doc_count: 1000 },
        };

        const aggs = {};
        const filters = ['foo'];

        coalesceFn.mockReturnValueOnce(aggs).mockReturnValueOnce(filters);

        renderComponent(ownProps, {}, {});

        await user.click(screen.getByRole('checkbox'));

        expect(toggleFilterFn).toHaveBeenCalled();
        expect(toggleFilterFn).toHaveReturnedWith({
          filterName: 'fieldName',
          filterValue: {
            doc_count: 1000,
            key: 'foo',
          },
          requery: 'REQUERY_ALWAYS',
          type: 'FILTER_CHANGED',
        });

        expect(replaceFiltersFn).not.toHaveBeenCalled();
      });
    });
  });
});
