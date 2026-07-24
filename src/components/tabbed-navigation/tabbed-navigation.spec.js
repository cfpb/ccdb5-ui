import { TabbedNavigation } from './tabbed-navigation';
import { MODE_LIST, MODE_MAP, MODE_TRENDS } from '../../constants';
import userEvent from '@testing-library/user-event';
import { screen, testRender as render } from '../../test-utils/test-utils';
import { merge } from '../../test-utils/function-helpers';
import { viewState } from '../../reducers/view/view-slice';

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
      expect(screen.getByRole('tab', { name: /Trends/ })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Trends/ })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(screen.getByRole('tab', { name: /List/ })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Map/ })).toBeInTheDocument();

      await user.click(screen.getByRole('tab', { name: /List/ }));
      expect(screen.getByRole('tab', { name: /List/ })).toHaveAttribute(
        'aria-selected',
        'true',
      );

      await user.click(screen.getByRole('tab', { name: /Map/ }));
      expect(screen.getByRole('tab', { name: /Map/ })).toHaveAttribute(
        'aria-selected',
        'true',
      );

      await user.click(screen.getByRole('tab', { name: /Trends/ }));
      expect(screen.getByRole('tab', { name: /Trends/ })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    it('shows the List tab', () => {
      renderComponent({ tab: MODE_LIST });
      expect(screen.getByRole('tab', { name: /List/ })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    it('shows the Map tab', () => {
      renderComponent({ tab: MODE_MAP });
      expect(screen.getByRole('tab', { name: /Map/ })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    it('shows the Trends tab', () => {
      renderComponent({ tab: MODE_TRENDS });
      expect(screen.getByRole('tab', { name: /Trends/ })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });
  });
});
