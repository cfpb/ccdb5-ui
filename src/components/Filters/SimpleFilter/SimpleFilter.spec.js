import { testRender as render, screen } from '../../../testUtils/test-utils';
import SimpleFilter from './SimpleFilter';
import { merge } from '../../../testUtils/functionHelpers';
import { defaultAggs } from '../../../reducers/aggs/aggs';
import { defaultQuery } from '../../../reducers/query/query';

const renderComponent = (props, newAggsState, newQueryState) => {
  merge(newAggsState, defaultAggs);
  merge(newQueryState, defaultQuery);

  const data = {
    aggs: newAggsState,
    query: newQueryState,
  };

  render(<SimpleFilter {...props} />, {
    preloadedState: data,
  });
};

describe('component:SimpleFilter', () => {
  describe('initial state', () => {
    const props = { title: 'nana', fieldName: 'company_response' };

    test('renders without crashing', () => {
      renderComponent(props, {}, {});
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        `Hide ${props.title} filter`,
      );
      expect(screen.getByText(props.title)).toBeInTheDocument();
    });

    test('shows if there are any active children', () => {
      const props = {
        fieldName: 'company_response',
        desc: 'This is a description',
        title: 'Title',
      };

      const aggs = {
        company_response: [
          { key: 'Closed with non-monetary relief', doc_count: 412732 },
          { key: 'Closed with explanation', doc_count: 345066 },
          { key: 'In progress', doc_count: 86400 },
          { key: 'Closed with monetary relief', doc_count: 244 },
          { key: 'Untimely response', doc_count: 178 },
        ],
      };

      const query = {};

      renderComponent(props, aggs, query);
      expect(screen.getByText('foobar')).toBeInTheDocument();
    });

    test('hides if there are no active children', () => {});
  });
});
