import { queryState } from '../../../reducers/query/querySlice';
import { resultsState } from '../../../reducers/results/resultsSlice';
import {
  testRender as render,
  screen,
  fireEvent,
} from '../../../testUtils/test-utils';
import { merge } from '../../../testUtils/functionHelpers';
import { Pagination } from './Pagination';
import * as pagingActions from '../../../reducers/query/querySlice';

describe('Pagination', () => {
  const renderComponent = (newQueryState, newResultsState) => {
    merge(newQueryState, queryState);
    merge(newResultsState, resultsState);

    const data = {
      query: newQueryState,
      results: newResultsState,
    };

    render(<Pagination />, {
      preloadedState: data,
    });
  };

  test('nextPageShown dispatched when Next button clicked', () => {
    const nextPageShownSpy = jest
      .spyOn(pagingActions, 'nextPageShown')
      .mockImplementation(() => jest.fn());
    const newQueryState = {
      page: 1,
      totalPages: 5,
    };

    renderComponent(newQueryState, { items: [1, 3, 4, 5] });
    fireEvent.click(screen.getByRole('button', { name: /Next/ }));

    expect(nextPageShownSpy).toBeCalledTimes(1);
  });

  test('prevPageShown dispatched when Previous button clicked', () => {
    const prevPageShownSpy = jest
      .spyOn(pagingActions, 'prevPageShown')
      .mockImplementation(() => jest.fn());
    const newQueryState = {
      page: 2,
      totalPages: 5,
    };

    renderComponent(newQueryState, { items: [1, 3, 4, 5] });
    fireEvent.click(screen.getByRole('button', { name: /Previous/ }));

    expect(prevPageShownSpy).toBeCalledTimes(1);
  });

  test('hides when there are no results', () => {
    const newQueryState = { page: 1, totalPages: 1 };

    renderComponent(newQueryState, { items: [] });

    expect(screen.queryByRole('button', { name: /Next/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /Previous/ })).toBeNull();
  });
});
