import { testRender as render, screen } from '../../../testUtils/test-utils';
import SimpleFilter from './SimpleFilter';
import { merge } from '../../../testUtils/functionHelpers';
import { aggsState } from '../../../reducers/aggs/aggsSlice';
import { filtersState } from '../../../reducers/filters/filtersSlice';

const renderComponent = (props, newAggsState, newFiltersState) => {
  merge(newAggsState, aggsState);
  merge(newFiltersState, filtersState);

  const data = {
    aggs: newAggsState,
    filters: newFiltersState,
  };

  return render(<SimpleFilter {...props} />, {
    preloadedState: data,
  });
};

describe('component:SimpleFilter', () => {
  let props, aggs, filters;

  beforeEach(() => {
    props = {
      fieldName: 'company_response',
      desc: 'This is a description',
      title: 'Title',
    };

    aggs = {
      company_response: [
        { key: 'Closed with non-monetary relief', doc_count: 412732 },
        { key: 'Closed with explanation', doc_count: 345066 },
        { key: 'In progress', doc_count: 86400 },
        { key: 'Closed with monetary relief', doc_count: 244 },
        { key: 'Untimely response', doc_count: 178 },
      ],
    };

    filters = {};
  });

  describe('initial state', () => {
    props = { title: 'nana', fieldName: 'company_response' };

    test('renders without crashing', () => {
      renderComponent(props, {}, {});
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        `Hide ${props.title} filter`,
      );
      expect(screen.getByText(props.title)).toBeInTheDocument();
    });

    test('shows if there are any active children', () => {
      filters = {
        company_response: ['Closed with non-monetary relief'],
      };

      renderComponent(props, aggs, filters);

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-expanded',
        'true',
      );

      aggs.company_response.forEach((response) => {
        expect(screen.getByText(response.key)).toBeInTheDocument();
      });
    });

    test('hides if there are no active children', () => {
      renderComponent(props, aggs, filters);

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-expanded',
        'false',
      );

      aggs.company_response.forEach((response) => {
        expect(screen.queryByText(response.key)).not.toBeInTheDocument();
      });
    });
  });
});
