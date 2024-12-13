import { FocusHeader } from './FocusHeader';
import { trendsState } from '../../../reducers/trends/trendsSlice';
import { merge } from '../../../testUtils/functionHelpers';
import {
  testRender as render,
  screen,
  fireEvent,
} from '../../../testUtils/test-utils';
import * as trendsActions from '../../../reducers/trends/trendsSlice';
import fetchMock from 'jest-fetch-mock';
import { focusCompanyTrends, focusProductTrends } from './fixture';
import { MODE_TRENDS } from '../../../constants';

const renderComponent = (newTrendsState) => {
  merge(newTrendsState, trendsState);
  const data = {
    routes: { queryString: '?sdfsd' },
    trends: newTrendsState,
    view: { tab: MODE_TRENDS },
  };

  render(<FocusHeader />, { preloadedState: data });
};

describe('component:FocusHeader', () => {
  let removeFocusSpy;
  beforeEach(() => {
    fetchMock.resetMocks();
    removeFocusSpy = jest
      .spyOn(trendsActions, 'focusRemoved')
      .mockImplementation(() => jest.fn());
  });

  it('renders header on Product focus page', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(focusProductTrends));
    renderComponent({
      focus: 'Credit card',
      lens: 'Product',
      subLens: 'sub_product',
    });
    expect(
      screen.getByRole('heading', { name: 'Credit card' }),
    ).toBeInTheDocument();

    await screen.findByRole('heading', { name: '83,763 Complaints' });

    expect(
      screen.getByRole('heading', { name: '83,763 Complaints' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /View product trends/ }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: /View product trends/ }),
    );
    expect(removeFocusSpy).toHaveBeenCalled();
    expect(
      screen.getByRole('button', { name: /Sub-products/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Issue/ })).toBeInTheDocument();
  });

  it('renders header on Company focus page', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(focusCompanyTrends));
    renderComponent({
      focus: 'CITIBANK, N.A.',
      lens: 'Company',
      subLens: 'product',
    });
    expect(
      screen.getByRole('heading', { name: 'CITIBANK, N.A.' }),
    ).toBeInTheDocument();
    await screen.findByRole('heading', { name: '31,573 Complaints' });
    expect(
      screen.getByRole('heading', { name: '31,573 Complaints' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /View company trends/ }),
    ).toBeInTheDocument();

    // no tabs should exist on Company Focus
    expect(
      screen.queryByRole('button', { name: /Sub-products/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Issue/ }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: /View company trends/ }),
    );
    expect(removeFocusSpy).toHaveBeenCalled();
  });
});
