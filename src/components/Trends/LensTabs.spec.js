import { LensTabs } from './LensTabs';
import { merge } from '../../testUtils/functionHelpers';
import { defaultQuery } from '../../reducers/query/query';
import { defaultTrends } from '../../reducers/trends/trends';
import { testRender as render, screen } from '../../testUtils/test-utils';
import * as trendsActions from '../../actions/trends';
import userEvent from '@testing-library/user-event';

const renderComponent = (newQueryState, newTrendsState) => {
  merge(newQueryState, defaultQuery);
  merge(newTrendsState, defaultTrends);
  const data = {
    query: newQueryState,
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
      .spyOn(trendsActions, 'changeDataSubLens')
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
    const newQ = {
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
      screen.getByRole('button', { name: 'Sub-products' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Issues' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Sub-products' }));
    expect(changeDataSubLensSpy).toHaveBeenCalledWith('sub_product');

    await user.click(screen.getByRole('button', { name: 'Issues' }));
    expect(changeDataSubLensSpy).toHaveBeenCalledWith('issue');
  });

  it('renders focus Product without crashing', () => {
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
      screen.getByRole('button', { name: 'Sub-products' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Issues' })).toBeInTheDocument();
  });

  it('hides focus Product tab without crashing', () => {
    const newQ = {
      focus: 'Foo Bar',
      lens: 'Product',
      subLens: 'sub_product',
    };

    const newT = {
      total: 90120,
      results: {
        issue: [2, 3, 4],
        'sub-product': [],
      },
    };

    renderComponent(newQ, newT);
    expect(screen.queryByRole('button', { name: 'Sub-products' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Issues' })).toBeInTheDocument();
  });
});
