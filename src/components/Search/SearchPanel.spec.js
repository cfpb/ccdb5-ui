import { SearchPanel } from './SearchPanel';
import { screen, testRender as render } from '../../testUtils/test-utils';
import fetchMock from 'jest-fetch-mock';
import { aggResponse } from '../Filters/Company/fixture';

const renderComponent = () => {
  const data = {
    query: { dateLastIndexed: '2024-10-07' },
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
    fetchMock.mockResponse(JSON.stringify(aggResponse));
    renderComponent();
    await screen.findByText(/last updated:/);
    expect(
      screen.getByText('Date Received: 11/4/2021 - 11/4/2024'),
    ).toBeInTheDocument();
  });
});
