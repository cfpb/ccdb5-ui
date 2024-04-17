import { FocusHeader } from './FocusHeader';
import { defaultQuery } from '../../reducers/query/query';
import { defaultTrends } from '../../reducers/trends/trends';
import { merge } from '../../testUtils/functionHelpers';
import { testRender as render, screen } from '../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import * as trendsActions from '../../actions/trends';

const renderComponent = (newQueryState, newTrendsState) => {
  merge(newQueryState, defaultQuery);
  merge(newTrendsState, defaultTrends);
  const data = {
    query: newQueryState,
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
      .spyOn(trendsActions, 'removeFocus')
      .mockImplementation(() => jest.fn());
  });

  it('renders header on Product focus page', async () => {
    const newQ = {
      focus: 'Foo Bar',
      lens: 'Product',
      subLens: 'sub_product',
    };
    const newT = {
      total: 90120,
      results: {
        issue: [2, 3, 4],
        'sub-product': [1, 2, 3],
      },
    };

    renderComponent(newQ, newT);
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
    const newQ = {
      focus: 'Acme Inc',
      lens: 'Company',
      subLens: 'product',
    };
    const newT = {
      total: 1234567,
      results: {
        product: [1, 2, 3],
      },
    };

    renderComponent(newQ, newT);
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
