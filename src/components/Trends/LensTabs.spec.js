import { LensTabs } from './LensTabs';
import { merge } from '../../testUtils/functionHelpers';
import { trendsState } from '../../reducers/trends/trendsSlice';
import { testRender as render, screen } from '../../testUtils/test-utils';
import * as trendsActions from '../../reducers/trends/trendsSlice';
import userEvent from '@testing-library/user-event';

const renderComponent = (newTrendsState) => {
  merge(newTrendsState, trendsState);
  const data = {
    trends: newTrendsState,
  };
  render(<LensTabs />, { preloadedState: data });
};

jest.useRealTimers();
describe('component:LensTabs', () => {
  const user = userEvent.setup();
  let changeDataSubLensSpy;
  beforeEach(() => {
    changeDataSubLensSpy = jest
      .spyOn(trendsActions, 'dataSubLensChanged')
      .mockImplementation(() => jest.fn());
  });

  it('does not render when Overview', () => {
    const newQ = {
      lens: 'Overview',
    };
    renderComponent(newQ, {});
    expect(screen.queryByText('Products')).toBeNull();
  });

  it('renders on Product without crashing', async () => {
    const newT = {
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
      screen.getByRole('button', { name: 'Sub-products' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Issues' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Sub-products' }));
    expect(changeDataSubLensSpy).toHaveBeenCalledWith('sub_product');

    await user.click(screen.getByRole('button', { name: 'Issues' }));
    expect(changeDataSubLensSpy).toHaveBeenCalledWith('issue');
  });

  it('renders focus Product without crashing', () => {
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
      screen.getByRole('button', { name: 'Sub-products' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Issues' })).toBeInTheDocument();
  });

  it('hides focus Product tab without crashing', () => {
    const newT = {
      focus: 'Foo Bar',
      lens: 'Product',
      subLens: 'sub_product',
      total: 90120,
      results: {
        issue: [2, 3, 4],
        'sub-product': [],
      },
    };

    renderComponent(newT);
    expect(screen.queryByRole('button', { name: 'Sub-products' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Issues' })).toBeInTheDocument();
  });
});
