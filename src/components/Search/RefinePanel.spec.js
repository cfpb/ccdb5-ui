import { RefinePanel } from './RefinePanel';
import { queryState } from '../../reducers/query/querySlice';
import { viewState } from '../../reducers/view/viewSlice';
import { merge } from '../../testUtils/functionHelpers';
import { testRender as render, screen } from '../../testUtils/test-utils';
import { MODE_TRENDS } from '../../constants';

describe('RefinePanel', () => {
  const renderComponent = (newQueryState, newViewState) => {
    merge(newQueryState, queryState);
    merge(newViewState, viewState);
    const data = {
      query: newQueryState,
      view: newViewState,
    };
    render(<RefinePanel />, {
      preloadedState: data,
    });
  };

  it('renders nothing in mobile view', () => {
    renderComponent({}, {});
    expect(screen.queryByText('State')).not.toBeInTheDocument();
  });
  it('renders in desktop view', () => {
    renderComponent({ tab: MODE_TRENDS }, { width: 1000 });
    expect(
      screen.getByRole('heading', { name: 'Filter results by...' }),
    ).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: 'State' })).toBeInTheDocument();
  });
});
