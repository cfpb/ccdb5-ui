import { SearchPanel } from './SearchPanel';
import { testRender as render, screen } from '../../testUtils/test-utils';
import fetchMock from 'jest-fetch-mock';
import { aggResponse } from '../Filters/Company/fixture';

const renderComponent = () => {
  const data = {
    routes: { queryString: '?fdsafsfoo' },
  };

  render(<SearchPanel />, {
    preloadedState: data,
  });
};

describe('component:SearchPanel', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('renders without crashing', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(aggResponse));
    renderComponent();
    await screen.findByText(/last updated:/);
    expect(screen.getByText(/11\/4\/2024/)).toBeInTheDocument();
  });
});
