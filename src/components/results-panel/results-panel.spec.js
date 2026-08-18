import { ResultsPanel } from './results-panel';
import { screen, testRender as render } from '../../test-utils/test-utils';
import { queryState } from '../../reducers/query/query-slice';
import { viewState } from '../../reducers/view/view-slice';
import { merge } from '../../test-utils/function-helpers';
import fetchMock from 'jest-fetch-mock';
import { aggResponse } from '../list/list-panel/fixture';

describe('ResultsPanel', () => {
  const renderComponent = (newQueryState, newViewState) => {
    merge(newQueryState, queryState);
    merge(newViewState, viewState);

    render(<ResultsPanel />, {
      preloadedState: {
        query: newQueryState,
        view: newViewState,
      },
    });
  };

  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify(aggResponse));
  });

  it('renders list panel without crashing', async () => {
    renderComponent({}, {});
    expect(
      await screen.findByText(/Showing .* total complaints/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Download complaint data/i }),
    ).toBeInTheDocument();
  });

  it('renders printMode without crashing', async () => {
    renderComponent({ searchText: 'Tacos' }, { isPrintMode: true });
    expect(screen.getByText('Search Term:')).toBeInTheDocument();
    expect(screen.getByText('Tacos')).toBeInTheDocument();
    expect(screen.getByText('URL:')).toBeInTheDocument();
    expect(
      await screen.findByText(/Showing .* total complaints/),
    ).toBeInTheDocument();
  });
});
