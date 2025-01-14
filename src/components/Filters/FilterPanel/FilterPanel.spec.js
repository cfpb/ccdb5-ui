import { FilterPanel } from './FilterPanel';
import { merge } from '../../../testUtils/functionHelpers';
import { viewState } from '../../../reducers/view/viewSlice';
import { testRender as render, screen } from '../../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';

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
  const user = userEvent.setup({ delay: null });

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
      screen.getByRole('heading', { name: 'Filter results by...' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Close filters/ }),
    ).not.toBeInTheDocument();
  });

  it('renders button at mobile width', async () => {
    viewStore.width = 600;
    viewStore.hasFilters = true;
    renderComponent(viewStore);
    expect(
      screen.getByRole('button', { name: /Close filters/ }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Close filters/ }));
    expect(
      screen.queryByRole('heading', { name: 'Filter results by...' }),
    ).not.toBeInTheDocument();
  });
});
