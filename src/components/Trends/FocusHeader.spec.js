import { FocusHeader } from './FocusHeader';
import { trendsState } from '../../reducers/trends/trendsSlice';
import { merge } from '../../testUtils/functionHelpers';
import { testRender as render, screen } from '../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import * as trendsActions from '../../reducers/trends/trendsSlice';

const renderComponent = (newTrendsState) => {
  merge(newTrendsState, trendsState);
  const data = {
    trends: newTrendsState,
  };

  render(<FocusHeader />, { preloadedState: data });
};

jest.useRealTimers();
describe('component:FocusHeader', () => {
  const user = userEvent.setup();
  let removeFocusSpy;
  beforeEach(() => {
    removeFocusSpy = jest
      .spyOn(trendsActions, 'focusRemoved')
      .mockImplementation(() => jest.fn());
  });

  it('renders header on Product focus page', async () => {
    const newT = {
      focus: 'Foo Bar',
      lens: 'Product',
      subLens: 'sub_product',
      total: 90120,
      results: {
        issue: [2, 3, 4],
        'sub-product': [1, 2, 3],
      },
    };

    renderComponent(newT);
    expect(
      screen.getByRole('heading', { name: 'Foo Bar' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '90,120 Complaints' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /View product trends/ }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /View product trends/ }),
    );
    expect(removeFocusSpy).toHaveBeenCalled();
    expect(
      screen.getByRole('button', { name: /Sub-products/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Issue/ })).toBeInTheDocument();
  });

  it('renders header on Company focus page', async () => {
    const newT = {
      focus: 'Acme Inc',
      lens: 'Company',
      subLens: 'product',
      total: 1234567,
      results: {
        product: [1, 2, 3],
      },
    };

    renderComponent(newT);
    expect(
      screen.getByRole('heading', { name: 'Acme Inc' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '1,234,567 Complaints' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /View company trends/ }),
    ).toBeInTheDocument();

    // no tabs should exist on Company Focus
    expect(screen.queryByRole('button', { name: /Sub-products/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /Issue/ })).toBeNull();

    await user.click(
      screen.getByRole('button', { name: /View company trends/ }),
    );
    expect(removeFocusSpy).toHaveBeenCalled();
  });
});
