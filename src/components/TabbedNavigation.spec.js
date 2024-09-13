import { testRender as render, screen } from '../testUtils/test-utils';
import { TabbedNavigation } from './TabbedNavigation';
import { MODE_LIST, MODE_MAP, MODE_TRENDS } from '../constants';
import { merge } from '../testUtils/functionHelpers';
import { defaultQuery } from '../reducers/query/query';
import userEvent from '@testing-library/user-event';
import * as viewActions from '../actions/view';

const renderComponent = (tab) => {
  const newQueryState = {
    tab,
  };

  merge(newQueryState, defaultQuery);

  const data = {
    query: newQueryState,
  };
  render(<TabbedNavigation />, {
    preloadedState: data,
  });
};

describe('component: TabbedNavigation', () => {
  const user = userEvent.setup({ delay: null });
  let tabChangedSpy;
  beforeEach(() => {
    tabChangedSpy = jest.spyOn(viewActions, 'tabChanged');
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows the List tab', async () => {
    renderComponent(MODE_LIST);
    expect(screen.getByRole('button', { name: /Map/ })).not.toHaveClass(
      'active',
    );
    expect(screen.getByRole('button', { name: /List/ })).toHaveClass('active');
    expect(screen.getByRole('button', { name: /Trends/ })).not.toHaveClass(
      'active',
    );

    await user.click(screen.getByRole('button', { name: /Map/ }));
    await user.click(screen.getByRole('button', { name: /List/ }));
    expect(tabChangedSpy).toHaveBeenCalledWith('List');
  });

  it('shows the Map tab', async () => {
    renderComponent(MODE_MAP);
    expect(screen.getByRole('button', { name: /Map/ })).toHaveClass('active');
    expect(screen.getByRole('button', { name: /List/ })).not.toHaveClass(
      'active',
    );
    expect(screen.getByRole('button', { name: /Trends/ })).not.toHaveClass(
      'active',
    );

    // this does nothing
    await user.click(screen.getByRole('button', { name: /List/ }));
    await user.click(screen.getByRole('button', { name: /Map/ }));
    expect(tabChangedSpy).toHaveBeenCalledWith('Map');
  });

  it('shows the Trends tab', async () => {
    renderComponent(MODE_TRENDS);
    expect(screen.getByRole('button', { name: /Map/ })).not.toHaveClass(
      'active',
    );
    expect(screen.getByRole('button', { name: /List/ })).not.toHaveClass(
      'active',
    );
    expect(screen.getByRole('button', { name: /Trends/ })).toHaveClass(
      'active',
    );

    await user.click(screen.getByRole('button', { name: /Map/ }));
    await user.click(screen.getByRole('button', { name: /Trends/ }));
    expect(tabChangedSpy).toHaveBeenCalledWith('Trends');
  });
});
