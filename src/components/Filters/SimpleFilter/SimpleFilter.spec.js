import { testRender as render, screen } from '../../../testUtils/test-utils';
import SimpleFilter from './SimpleFilter';
import { merge } from '../../../testUtils/functionHelpers';
import { aggsState } from '../../../reducers/aggs/aggsSlice';

const renderComponent = (props, newAggsState) => {
  merge(newAggsState, aggsState);

  const data = {
    aggs: newAggsState,
  };

  return render(<SimpleFilter {...props} />, {
    preloadedState: data,
  });
};

describe('component::SimpleFilter', () => {
  let props;

  beforeEach(() => {
    props = {
      fieldName: 'company_response',
      desc: 'This is a description',
      title: 'Title',
    };
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
  });
});
