import { FilterPanel } from './filter-panel';
import { merge } from '../../../test-utils/function-helpers';
import { viewState } from '../../../reducers/view/view-slice';
import { screen, testRender as render } from '../../../test-utils/test-utils';

const renderComponent = (newViewState) => {
  merge(newViewState, viewState);

  const data = {
    view: newViewState,
  };

  render(<FilterPanel />, {
    preloadedState: data,
  });
};

describe('FilterPanel', () => {
  let viewStore;
  beforeEach(() => {
    viewStore = {
      hasFilters: true,
      width: 1000,
    };
  });

  afterEach(() => {});
  it('renders without crashing', () => {
    renderComponent(viewStore);
    expect(
      screen.getByRole('heading', { name: 'Filter results by' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Close filters/ }),
    ).not.toBeInTheDocument();
  });

  it('renders filters without a close button at mobile width', () => {
    viewStore.width = 600;
    viewStore.hasFilters = true;
    renderComponent(viewStore);
    expect(
      screen.getByRole('heading', { name: 'Filter results by' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Close filters/ }),
    ).not.toBeInTheDocument();
  });
});
