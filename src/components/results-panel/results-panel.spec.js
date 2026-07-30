import { ResultsPanel } from './results-panel';
import { screen, testRender as render } from '../../test-utils/test-utils';
import { queryState } from '../../reducers/query/query-slice';
import { viewState } from '../../reducers/view/view-slice';
import { merge } from '../../test-utils/function-helpers';
import { MODE_LIST, MODE_MAP } from '../../constants';

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

  it('renders trends panel without crashing', () => {
    renderComponent({});
    expect(screen.getByRole('button', { name: /Trends/ })).toHaveClass(
      'active',
    );
    expect(screen.getByRole('button', { name: /List/ })).not.toHaveClass(
      'active',
    );
    expect(screen.getByRole('button', { name: /Map/ })).not.toHaveClass(
      'active',
    );
    expect(screen.getByText('Export data')).toBeInTheDocument();
  });

  it('renders list panel without crashing', () => {
    renderComponent({}, { tab: MODE_LIST });
    expect(screen.getByRole('button', { name: /Trends/ })).not.toHaveClass(
      'active',
    );
    expect(screen.getByRole('button', { name: /List/ })).toHaveClass('active');
    expect(screen.getByRole('button', { name: /Map/ })).not.toHaveClass(
      'active',
    );
    expect(screen.getByText('Export data')).toBeInTheDocument();
  });

  it('renders map panel without crashing', () => {
    renderComponent({}, { tab: MODE_MAP });
    expect(screen.getByRole('button', { name: /Trends/ })).not.toHaveClass(
      'active',
    );
    expect(screen.getByRole('button', { name: /List/ })).not.toHaveClass(
      'active',
    );
    expect(screen.getByRole('button', { name: /Map/ })).toHaveClass('active');
    expect(screen.getByText('Export data')).toBeInTheDocument();
  });

  it('renders printMode without crashing', () => {
    renderComponent(
      { searchText: 'Tacos' },
      { isPrintMode: true, tab: MODE_MAP },
    );
    expect(screen.getByRole('button', { name: /Trends/ })).not.toHaveClass(
      'active',
    );
    expect(screen.getByRole('button', { name: /List/ })).not.toHaveClass(
      'active',
    );
    expect(screen.getByRole('button', { name: /Map/ })).toHaveClass('active');
    expect(screen.getByText('Export data')).toBeInTheDocument();
    expect(screen.getByText('Search Term:')).toBeInTheDocument();
    expect(screen.getByText('Tacos')).toBeInTheDocument();
    expect(screen.getByText('URL:')).toBeInTheDocument();
  });
});
