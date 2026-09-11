import * as pagingActions from '../../../reducers/query/query-slice';
import { queryState } from '../../../reducers/query/query-slice';
import {
  fireEvent,
  screen,
  testRender as render,
} from '../../../test-utils/test-utils';
import { merge } from '../../../test-utils/function-helpers';
import { Pagination } from './pagination';
import { listResponseP1, listResponseP2 } from './fixture';

describe('Pagination', () => {
  const renderComponent = (newQueryState) => {
    merge(newQueryState, queryState);
    const data = {
      query: newQueryState,
      routes: { queryString: '?sdfsda' },
      view: {},
    };

    render(<Pagination />, {
      preloadedState: data,
    });
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('nextPageShown dispatched when Next button clicked', async () => {
    const nextPageShownSpy = rs
      .spyOn(pagingActions, 'nextPageShown')
      .mockImplementation(() => rs.fn());
    fetchMock.mockResponseOnce(JSON.stringify(listResponseP1));
    renderComponent({
      dateLastIndexed: '2020-05-05',
      page: 1,
    });
    await screen.findByText('Page 1');
    expect(screen.getByRole('button', { name: /Previous/ })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /Next/ }));
    expect(nextPageShownSpy).toHaveBeenCalledTimes(1);
  });

  test('prevPageShown dispatched when Previous button clicked', async () => {
    const prevPageShownSpy = rs
      .spyOn(pagingActions, 'prevPageShown')
      .mockImplementation(() => rs.fn());
    fetchMock.mockResponseOnce(JSON.stringify(listResponseP2));

    renderComponent({
      dateLastIndexed: '2020-05-05',
      page: 2,
    });

    await screen.findByText('Page 2');

    fireEvent.click(screen.getByRole('button', { name: /Previous/ }));

    expect(prevPageShownSpy).toHaveBeenCalledTimes(1);
  });

  test('hides when there are no results', () => {
    renderComponent({ dateLastIndexed: '2020-05-05', page: 1 });
    expect(
      screen.queryByRole('button', { name: /Next/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Previous/ }),
    ).not.toBeInTheDocument();
  });
});
