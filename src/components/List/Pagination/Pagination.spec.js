import React from 'react';
import { queryState } from '../../../reducers/query/query';
import {
  testRender as render,
  screen,
  fireEvent,
} from '../../../testUtils/test-utils';
import { merge } from '../../../testUtils/functionHelpers';
import { Pagination } from './Pagination';
import * as pagingActions from '../../../reducers/query/query';

describe('Pagination', () => {
  const renderComponent = (newQueryState, isReplacement = false) => {
    if (!isReplacement) {
      merge(newQueryState, queryState);
    }
    const data = {
      query: newQueryState,
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

    renderComponent(newQueryState);
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

    renderComponent(newQueryState);
    fireEvent.click(screen.getByRole('button', { name: /Previous/ }));

    expect(prevPageShownSpy).toBeCalledTimes(1);
  });

  test('total defaults to 1 when totalPages is not set and buttons are disabled', () => {
    const newQueryState = { page: 1 };

    renderComponent(newQueryState, true);

    expect(screen.getByRole('button', { name: /Next/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Previous/ })).toBeDisabled();
  });
});
