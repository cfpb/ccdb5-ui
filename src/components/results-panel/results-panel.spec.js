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
    expect(screen.getByRole('tab', { name: /Trends/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: /List/ })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    expect(screen.getByRole('tab', { name: /Map/ })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    expect(screen.getByRole('tabpanel')).toHaveAttribute('id', 'tabpanel-trends');
    expect(screen.getByText('Export data')).toBeInTheDocument();
  });

  it('renders list panel without crashing', () => {
    renderComponent({}, { tab: MODE_LIST });
    expect(screen.getByRole('tab', { name: /Trends/ })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    expect(screen.getByRole('tab', { name: /List/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: /Map/ })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    expect(screen.getByRole('tabpanel')).toHaveAttribute('id', 'tabpanel-list');
    expect(screen.getByText('Export data')).toBeInTheDocument();
  });

  it('renders map panel without crashing', () => {
    renderComponent({}, { tab: MODE_MAP });
    expect(screen.getByRole('tab', { name: /Trends/ })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    expect(screen.getByRole('tab', { name: /List/ })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    expect(screen.getByRole('tab', { name: /Map/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tabpanel')).toHaveAttribute('id', 'tabpanel-map');
    expect(screen.getByText('Export data')).toBeInTheDocument();
  });

  it('renders printMode without crashing', () => {
    renderComponent(
      { searchText: 'Tacos' },
      { isPrintMode: true, tab: MODE_MAP },
    );
    expect(screen.getByRole('tab', { name: /Trends/ })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    expect(screen.getByRole('tab', { name: /List/ })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    expect(screen.getByRole('tab', { name: /Map/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText('Export data')).toBeInTheDocument();
    expect(screen.getByText('Search Term:')).toBeInTheDocument();
    expect(screen.getByText('Tacos')).toBeInTheDocument();
    expect(screen.getByText('URL:')).toBeInTheDocument();
  });
});
