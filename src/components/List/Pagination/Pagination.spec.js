import { queryState } from '../../../reducers/query/querySlice';
import {
  testRender as render,
  screen,
  fireEvent,
} from '../../../testUtils/test-utils';
import { merge } from '../../../testUtils/functionHelpers';
import { Pagination } from './Pagination';
import * as pagingActions from '../../../reducers/query/querySlice';
import fetchMock from 'jest-fetch-mock';
import { listResponseP1, listResponseP2 } from './fixture';
import { MODE_LIST } from '../../../constants';

describe('Pagination', () => {
  const renderComponent = (newQueryState) => {
    merge(newQueryState, queryState);
    const data = {
      query: newQueryState,
      routes: { queryString: '?sdfsda' },
      view: { tab: MODE_LIST },
    };

    render(<Pagination />, {
      preloadedState: data,
    });
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('nextPageShown dispatched when Next button clicked', async () => {
    const nextPageShownSpy = jest
      .spyOn(pagingActions, 'nextPageShown')
      .mockImplementation(() => jest.fn());
    fetchMock.mockResponseOnce(JSON.stringify(listResponseP1));
    renderComponent({
      page: 1,
    });
    await screen.findByText('Page 1');
    expect(screen.getByRole('button', { name: /Previous/ })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /Next/ }));
    expect(nextPageShownSpy).toBeCalledTimes(1);
  });

  test('prevPageShown dispatched when Previous button clicked', async () => {
    const prevPageShownSpy = jest
      .spyOn(pagingActions, 'prevPageShown')
      .mockImplementation(() => jest.fn());
    fetchMock.mockResponseOnce(JSON.stringify(listResponseP2));

    renderComponent({
      page: 2,
    });

    await screen.findByText('Page 2');

    fireEvent.click(screen.getByRole('button', { name: /Previous/ }));

    expect(prevPageShownSpy).toBeCalledTimes(1);
  });

  test('hides when there are no results', () => {
    renderComponent({ page: 1 });
    expect(
      screen.queryByRole('button', { name: /Next/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Previous/ }),
    ).not.toBeInTheDocument();
  });
});
