import { FilterPanelToggle } from './FilterPanelToggle';
import { merge } from '../../../testUtils/functionHelpers';
import { viewState } from '../../../reducers/view/viewSlice';
import { screen, testRender as render } from '../../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';

const renderComponent = (newViewState) => {
  merge(newViewState, viewState);

  const data = {
    view: newViewState,
  };

  render(<FilterPanelToggle />, {
    preloadedState: data,
  });
};

describe('FilterPanelToggle', () => {
  const user = userEvent.setup({ delay: null });

  afterEach(() => {});
  it('renders filters toggle and toggle visibility', async () => {
    const viewStore = {
      hasFilters: true,
    };
    renderComponent(viewStore);
    expect(
      screen.getByRole('button', { name: /Close filters/ }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Close filters/ }));
    expect(
      screen.queryByRole('button', { name: /Close filters/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Filter results/ }),
    ).toBeInTheDocument();
  });
});
