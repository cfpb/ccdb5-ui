import { ResultsPanel } from './results-panel';
import { screen, testRender as render } from '../../test-utils/test-utils';
import { queryState } from '../../reducers/query/query-slice';
import { viewState } from '../../reducers/view/view-slice';
import { merge } from '../../test-utils/function-helpers';
import { MODE_LIST } from '../../constants';

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

  it('renders list panel without crashing', () => {
    renderComponent({}, { tab: MODE_LIST });
    expect(screen.getByText('Export data')).toBeInTheDocument();
  });

  it('renders printMode without crashing', () => {
    renderComponent(
      { searchText: 'Tacos' },
      { isPrintMode: true, tab: MODE_LIST },
    );
    expect(screen.getByText('Export data')).toBeInTheDocument();
    expect(screen.getByText('Search Term:')).toBeInTheDocument();
    expect(screen.getByText('Tacos')).toBeInTheDocument();
    expect(screen.getByText('URL:')).toBeInTheDocument();
  });
});
