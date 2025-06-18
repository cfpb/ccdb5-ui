import { TabbedNavigation } from './TabbedNavigation';
import { MODE_LIST, MODE_MAP, MODE_TRENDS } from '../../constants';
import userEvent from '@testing-library/user-event';
import { screen, testRender as render } from '../../testUtils/test-utils';
import { merge } from '../../testUtils/functionHelpers';
import { viewState } from '../../reducers/view/viewSlice';

jest.useRealTimers();
describe('component: TabbedNavigation', () => {
  const user = userEvent.setup();
  const renderComponent = (newViewState) => {
    merge(newViewState, viewState);

    const data = {
      view: newViewState,
    };

    render(<TabbedNavigation />, { preloadedState: data });
  };

  describe('initial state', () => {
    it('renders without crashing', async () => {
      renderComponent({});
      expect(
        screen.getByRole('button', { name: /Trends/ }),
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Trends/ })).toHaveClass(
        'active',
      );
      expect(screen.getByRole('button', { name: /List/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Map/ })).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /List/ }));
      expect(screen.getByRole('button', { name: /List/ })).toHaveClass(
        'active',
      );

      await user.click(screen.getByRole('button', { name: /Map/ }));
      expect(screen.getByRole('button', { name: /Map/ })).toHaveClass('active');

      await user.click(screen.getByRole('button', { name: /Trends/ }));
      expect(screen.getByRole('button', { name: /Trends/ })).toHaveClass(
        'active',
      );
    });

    it('shows the List tab', () => {
      renderComponent({ tab: MODE_LIST });
      expect(screen.getByRole('button', { name: /List/ })).toHaveClass(
        'active',
      );
    });

    it('shows the Map tab', () => {
      renderComponent({ tab: MODE_MAP });
      expect(screen.getByRole('button', { name: /Map/ })).toHaveClass('active');
    });

    it('shows the Trends tab', () => {
      renderComponent({ tab: MODE_TRENDS });
      expect(screen.getByRole('button', { name: /Trends/ })).toHaveClass(
        'active',
      );
    });
  });
});
