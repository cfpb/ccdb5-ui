import { RefinePanel } from './refine-panel';
import { queryState } from '../../reducers/query/query-slice';
import { viewState } from '../../reducers/view/view-slice';
import { merge } from '../../test-utils/function-helpers';
import { screen, testRender as render } from '../../test-utils/test-utils';

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
    renderComponent({}, { width: 1000 });
    expect(
      screen.getByRole('heading', { name: 'Filter results by' }),
    ).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: 'State' })).toBeInTheDocument();
  });
});
