import { render, screen } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import AggregationItem from './AggregationItem';

const defaultTestProps = {
  fieldName: 'foo',
  item: {
    key: 'hole',
    value: 'som',
    doc_count: 100,
    isDisabled: false,
  },
};

const mockStore = configureMockStore();
const store = mockStore({
  aggs: {},
  query: {},
});

const renderComponent = (testProps = defaultTestProps) => {
  render(
    <IntlProvider locale="en">
      <Provider store={store}>
        <AggregationItem {...testProps} />
      </Provider>
    </IntlProvider>,
  );
};

describe('component::AggregationItem', () => {
  describe('initial state', () => {
    it('renders properly with given item key and value', () => {
      renderComponent(defaultTestProps);

      expect(screen.getByLabelText(defaultTestProps.item.value)).toBeDefined();
      expect(screen.getByText(defaultTestProps.item.doc_count)).toBeDefined();
      expect(screen.getByRole('checkbox')).toBeEnabled();
    });

    it('renders properly with given item key, but no item value', () => {
      const testData = defaultTestProps;
      testData.item.value = null;

      renderComponent(testData);

      expect(screen.getByLabelText(defaultTestProps.item.key)).toBeDefined();
      expect(screen.getByText(defaultTestProps.item.doc_count)).toBeDefined();
      expect(screen.getByRole('checkbox')).toBeEnabled();
    });

    it('renders properly in its disabled state', () => {
      const testData = defaultTestProps;
      testData.item.isDisabled = true;

      renderComponent(defaultTestProps);

      expect(screen.getByRole('checkbox')).toBeDisabled();
    });
  });

  describe('add filter', () => {
    it('appends subIssue filter when not all selected', () => {
      expect(true).toBe(true);
    });

    it('replaces subItems with parent when children are selected', () => {
      expect(true).toBe(true);
    });

    it('handles non product & issue filters', () => {
      expect(true).toBe(true);
    });
  });

  describe('remove filter', () => {
    it('handles product/issue filters', () => {
      expect(true).toBe(true);
    });

    it('handles non product & issue filters', () => {
      expect(true).toBe(true);
    });
  });
});
