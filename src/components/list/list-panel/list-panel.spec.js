import {
  fireEvent,
  screen,
  testRender as render,
} from '../../../test-utils/test-utils';
import { ListPanel } from './list-panel';
import fetchMock from 'jest-fetch-mock';
import { merge } from '../../../test-utils/function-helpers';
import { filtersState } from '../../../reducers/filters/filters-slice';

import * as pagingActions from '../../../reducers/query/query-slice';
import { queryState } from '../../../reducers/query/query-slice';
import { viewState } from '../../../reducers/view/view-slice';
import * as utils from '../../../utils';
import { aggResponse, listResponse } from './fixture';

describe('ListPanel', () => {
  const renderComponent = (newQueryState, newViewState) => {
    newQueryState.dateLastIndexed = '2020-01-01';
    merge(newQueryState, queryState);
    merge(newViewState, viewState);
    const data = {
      filters: filtersState,
      query: newQueryState,
      routes: { queryString: '?sdafds' },
      view: newViewState,
    };

    render(<ListPanel />, {
      preloadedState: data,
    });
  };

  const analyticsSpy = jest
    .spyOn(utils, 'sendAnalyticsEvent')
    .mockImplementation(() => jest.fn());

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('Render ListPanel with no results', () => {
    fetchMock.mockResponseOnce(JSON.stringify(aggResponse));
    renderComponent({}, viewState);

    expect(
      screen.getByRole('heading', {
        name: /No results were found for your search/,
      }),
    ).toBeInTheDocument();
  });

  test('Render ListPanel with an error', async () => {
    fetchMock.mockReject(new Error('Something broke'));
    renderComponent({}, {});

    await screen.findByText(/There was a problem executing your search/);
    expect(
      screen.getByText(/There was a problem executing your search/),
    ).toBeInTheDocument();
  });

  test('Render ListPanel with items', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(aggResponse));
    fetchMock.mockResponseOnce(JSON.stringify(listResponse));

    renderComponent({}, {});

    const elements = await screen.findAllByText('EQUIFAX, INC.');
    expect(elements).toHaveLength(25);

    const el = await screen.findAllByRole('heading', {
      name: 'Complaint ID',
    });
    expect(el).toHaveLength(25);
  });

  test('onSize triggers dispatch and analytics event', () => {
    const sizeChangedSpy = jest
      .spyOn(pagingActions, 'sizeChanged')
      .mockImplementation(() => jest.fn());
    const newQueryState = {
      size: 25,
      sort: 'created_date_desc',
    };
    renderComponent(newQueryState, {});
    fireEvent.change(
      screen.getByRole('combobox', {
        name: 'Show per page',
      }),
      { target: { value: '10' } },
    );

    expect(analyticsSpy).toHaveBeenCalledWith('Dropdown', '10 results');
    expect(sizeChangedSpy).toHaveBeenCalledWith('10');
  });

  test('onSort triggers dispatch and analytics event', () => {
    const sortChangedSpy = jest
      .spyOn(pagingActions, 'sortChanged')
      .mockImplementation(() => jest.fn());
    const newQueryState = {
      size: 25,
      sort: 'created_date_desc',
    };

    renderComponent(newQueryState, {});
    fireEvent.change(
      screen.getByRole('combobox', {
        name: 'Sort by',
      }),
      { target: { value: 'created_date_asc' } },
    );

    expect(analyticsSpy).toHaveBeenCalledWith('Dropdown', 'Oldest to newest');
    expect(sortChangedSpy).toHaveBeenCalledWith('created_date_asc');
  });

  test('FilterPanel showed when width is 500', () => {
    const newViewState = { width: 500 };

    renderComponent({}, newViewState);

    expect(screen.getByText('Filter results by')).toBeInTheDocument();
  });

  test('FilterPanel not showed when width is 1000', async () => {
    const newViewState = { width: 1000 };
    fetchMock.mockResponse((req) => {
      const url = new URL(req.url);
      const params = url.searchParams;

      if (params.get('size') === '0') {
        // this is the list
        return Promise.resolve({
          body: JSON.stringify(aggResponse),
        });
      }
      if (params.get('size') === '25') {
        return Promise.resolve({
          body: JSON.stringify(listResponse),
        });
      }
    });
    renderComponent({}, newViewState);

    await screen.findByText('Show per page');
    expect(screen.queryByText('Filter results by')).not.toBeInTheDocument();
  });
});
