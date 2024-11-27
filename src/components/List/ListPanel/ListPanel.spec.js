import {
  testRender as render,
  screen,
  fireEvent,
} from '../../../testUtils/test-utils';
import { ListPanel } from './ListPanel';
import fetchMock from 'jest-fetch-mock';
import { merge } from '../../../testUtils/functionHelpers';
import { filtersState } from '../../../reducers/filters/filtersSlice';

import { queryState } from '../../../reducers/query/querySlice';
import { viewState } from '../../../reducers/view/viewSlice';
import * as utils from '../../../utils';
import * as pagingActions from '../../../reducers/query/querySlice';
import { aggResponse, listResponse } from './fixture';
import { MODE_LIST } from '../../../constants';

describe('ListPanel', () => {
  const renderComponent = (newQueryState, newViewState) => {
    newViewState.tab = MODE_LIST;
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
    renderComponent(queryState, viewState);

    expect(
      screen.getByRole('heading', {
        name: /No results were found for your search/,
      }),
    ).toBeDefined();
  });

  test('Render ListPanel with an error', async () => {
    fetchMock.mockReject(new Error('Something broke'));
    renderComponent(queryState, {});

    await screen.findByText(/There was a problem executing your search/);
    expect(
      screen.getByText(/There was a problem executing your search/),
    ).toBeDefined();
  });

  test('Render ListPanel with items', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(aggResponse));
    fetchMock.mockResponseOnce(JSON.stringify(listResponse));

    renderComponent(queryState, {});

    const elements = await screen.findAllByText('EQUIFAX, INC.');
    expect(elements).toHaveLength(25);

    const el = await screen.findAllByText('Date received:');
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
        name: 'Select the number of results to display at a time',
      }),
      { target: { value: '10' } },
    );

    expect(analyticsSpy).toBeCalledWith('Dropdown', '10 results');
    expect(sizeChangedSpy).toBeCalledWith('10');
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
        name: 'Choose the order in which the results are displayed',
      }),
      { target: { value: 'created_date_asc' } },
    );

    expect(analyticsSpy).toBeCalledWith('Dropdown', 'Oldest to newest');
    expect(sortChangedSpy).toBeCalledWith('created_date_asc');
  });

  test('FilterPanel showed when width is 500', () => {
    const newViewState = { width: 500 };

    renderComponent(queryState, newViewState);

    expect(screen.getByText('Filter results by...')).toBeInTheDocument();
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
      } else if (params.get('size') === '25') {
        return Promise.resolve({
          body: JSON.stringify(listResponse),
        });
      }
    });
    renderComponent(queryState, newViewState);

    await screen.findByRole('button', { name: 'Export data' });
    expect(screen.queryByText('Filter results by...')).not.toBeInTheDocument();
  });
});
