import { LensTabs } from './LensTabs';
import { merge } from '../../../testUtils/functionHelpers';
import { trendsState } from '../../../reducers/trends/trendsSlice';
import {
  testRender as render,
  screen,
  fireEvent,
} from '../../../testUtils/test-utils';
import * as trendsActions from '../../../reducers/trends/trendsSlice';
import fetchMock from 'jest-fetch-mock';
import { focusProductTrends } from '../FocusHeader/fixture';
import { MODE_TRENDS } from '../../../constants';
const renderComponent = (newTrendsState) => {
  merge(newTrendsState, trendsState);
  const data = {
    routes: { queryString: '?sdfsd' },
    trends: newTrendsState,
    view: { tab: MODE_TRENDS },
  };
  render(<LensTabs />, { preloadedState: data });
};

describe('component:LensTabs', () => {
  let changeDataSubLensSpy;
  beforeEach(() => {
    fetchMock.resetMocks();
    changeDataSubLensSpy = jest
      .spyOn(trendsActions, 'dataSubLensChanged')
      .mockImplementation(() => jest.fn());
    fetchMock.mockResponseOnce(JSON.stringify(focusProductTrends));
  });

  it('does not render when Overview', () => {
    renderComponent({
      lens: 'Overview',
    });
    expect(screen.queryByText('Products')).not.toBeInTheDocument();
  });

  it('renders on Product without crashing', async () => {
    renderComponent({
      lens: 'Product',
      subLens: 'sub_product',
    });
    await screen.findByRole('button', { name: 'Sub-products' });
    expect(
      screen.getByRole('button', { name: 'Sub-products' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Issues' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Sub-products' }));
    expect(changeDataSubLensSpy).toHaveBeenCalledWith('sub_product');

    fireEvent.click(screen.getByRole('button', { name: 'Issues' }));
    expect(changeDataSubLensSpy).toHaveBeenCalledWith('issue');
  });

  it('renders focus Product without crashing', async () => {
    renderComponent({
      focus: 'Credit card',
      lens: 'Product',
      subLens: 'sub_product',
    });
    await screen.findByRole('button', { name: 'Sub-products' });
    expect(
      screen.getByRole('button', { name: 'Sub-products' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Issues' })).toBeInTheDocument();
  });
});
