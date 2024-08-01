import { testRender as render, screen } from '../../../testUtils/test-utils';
import SimpleFilter, { extraData } from './SimpleFilter';

describe('component:SimpleFilter', () => {
  describe('initial state', () => {
    const props = { title: 'nana', fieldName: 'company_response' };

    test('renders without crashing', () => {
      render(<SimpleFilter {...props} />);
      //first assertion is for ensuring that proper class is passed from SimpleFilter to child component
      expect(screen.getByTestId('collapse-filter')).toHaveClass(
        props.fieldName,
      );
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        `Hide ${props.title} filter`,
      );
      expect(screen.getByText(props.title)).toBeInTheDocument();
    });
  });

  describe('extra data', () => {
    let props, aggs, query;

    beforeEach(() => {
      props = {
        fieldName: 'foo',
        desc: 'This is a description',
        title: 'Title',
      };

      aggs = {
        foo: [1, 2, 3, 4, 5, 6],
      };

      query = {
        foo: [1],
      };
    });

    test('shows if there are any active children', () => {
      expect(extraData(props.fieldName, aggs, query)).toEqual({
        options: [1, 2, 3, 4, 5, 6],
        hasChildren: true,
      });
    });

    test('hides if there are no active children', () => {
      query.foo = [];
      expect(extraData(props.fieldName, aggs, query)).toEqual({
        options: [1, 2, 3, 4, 5, 6],
        hasChildren: false,
      });
    });
  });
});
