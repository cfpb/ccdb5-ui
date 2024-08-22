import { testRender as render, screen } from '../../../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import { merge } from '../../../../testUtils/functionHelpers';
import { defaultQuery } from '../../../../reducers/query/query';
import * as filter from '../../../../actions/filter';
import { AggregationBranch } from './AggregationBranch';

const fieldName = 'abc';

const item = {
  key: 'foo',
  doc_count: 99,
};

const subitems = [
  { key: 'bar', doc_count: 90 },
  { key: 'baz', doc_count: 5 },
  { key: 'qaz', doc_count: 4 },
];

const renderComponent = (props, newQueryState) => {
  merge(newQueryState, defaultQuery);

  const data = {
    query: newQueryState,
  };

  return render(<AggregationBranch {...props} />, {
    preloadedState: data,
  });
};

let props;

describe('component::AggregationBranch', () => {
  beforeEach(() => {
    props = {
      fieldName,
      item,
      subitems,
    };
  });

  describe('initial state', () => {
    test('renders as list item button with unchecked state when one or more subitems are present', () => {
      renderComponent(props);

      expect(screen.getByRole('checkbox')).not.toBeChecked();
      expect(screen.getByLabelText(props.item.key)).toBeInTheDocument();
      expect(
        screen.getByText(props.item.key, { selector: 'button' }),
      ).toBeInTheDocument();
      expect(screen.getByText(props.item.doc_count)).toBeInTheDocument();
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    test('renders list item button with disabled checkbox when item property is disabled', () => {
      const aitem = { ...item, isDisabled: true };
      props.item = aitem;

      renderComponent(props);

      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    test('renders AggregationItem when no subitems are present', () => {
      props.subitems = [];

      renderComponent(props);

      //list item doesn't render with toggle button;
      //no need to test rendering of values, since it's covered by AggregationItem tests
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    test('renders with checkbox in checked state', () => {
      const query = {
        abc: [props.item.key],
      };

      renderComponent(props, query);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    test('renders with checkbox in indeterminate state', () => {
      const query = {
        abc: [`${props.item.key}•${props.subitems[0].key}`],
      };

      renderComponent(props, query);
      expect(
        screen.getByRole('checkbox', { indeterminate: true }),
      ).toBeInTheDocument();
    });
  });

  describe('toggle states', () => {
    const user = userEvent.setup({ delay: null });

    let replaceFiltersFn, removeMultipleFiltersFn;

    beforeEach(() => {
      replaceFiltersFn = jest.spyOn(filter, 'replaceFilters');
      removeMultipleFiltersFn = jest.spyOn(filter, 'removeMultipleFilters');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('should properly check the component', async () => {
      renderComponent(props);

      await user.click(screen.getByRole('checkbox'));

      expect(replaceFiltersFn).toHaveBeenCalledWith(props.fieldName, ['foo']);
    });

    test('should properly uncheck the component', async () => {
      const query = {
        abc: [props.item.key],
      };

      renderComponent(props, query);

      await user.click(screen.getByRole('checkbox'));

      expect(removeMultipleFiltersFn).toHaveBeenCalledWith(props.fieldName, [
        'foo',
        'foo•bar',
        'foo•baz',
        'foo•qaz',
      ]);
    });

    test('should show children list items on button click', async () => {
      renderComponent(props);

      await user.click(screen.getByRole('button'));

      expect(screen.getByRole('list')).toBeInTheDocument();
    });
  });
});
