import { testRender as render, screen } from '../../../testUtils/test-utils';
import { SimpleFilter } from './SimpleFilter';
import fetchMock from 'jest-fetch-mock';
import { aggResponse } from '../../List/ListPanel/fixture';
const renderComponent = (props) => {
  const data = {
    routes: { queryString: '?sfas' },
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
    fetchMock.resetMocks();
  });

  describe('initial state', () => {
    props = { title: 'nana', fieldName: 'company_response' };

    it('renders without crashing', () => {
      fetchMock.mockResponseOnce(JSON.stringify(aggResponse));
      renderComponent(props);
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        `Collapse ${props.title} filter`,
      );
      expect(screen.getByText(props.title)).toBeInTheDocument();
    });
  });
});
