import { FilterPanelToggle } from './filter-panel-toggle';
import { merge } from '../../../test-utils/function-helpers';
import { viewState } from '../../../reducers/view/view-slice';
import { screen, testRender as render } from '../../../test-utils/test-utils';
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
    const button = screen.getByRole('button', { name: /Filter results/ });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    await user.click(button);
    expect(
      screen.getByRole('button', { name: /Filter results/ }),
    ).toHaveAttribute('aria-expanded', 'false');
  });
});
