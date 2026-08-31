import { SearchPanel } from './search-panel';
import { screen, testRender as render } from '../../test-utils/test-utils';
import { aggResponse } from '../filters/company/fixture';

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
    await screen.findByText(/Last updated/);
    expect(
      screen.getByText('Date Received: 11/4/2021 - 11/4/2024'),
    ).toBeInTheDocument();
  });
});
