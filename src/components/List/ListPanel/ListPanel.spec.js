import React from 'react';
import {
  testRender as render,
  screen,
  fireEvent,
} from '../../../testUtils/test-utils';
import { ListPanel } from './ListPanel';
import { IntlProvider } from 'react-intl';
import { merge } from '../../../testUtils/functionHelpers';
import { defaultAggs } from '../../../reducers/aggs/aggs';
import { defaultQuery } from '../../../reducers/query/query';
import { defaultResults } from '../../../reducers/results/results';
import { defaultView } from '../../../reducers/view/view';
import * as utils from '../../../utils';
import * as pagingActions from '../../../actions/paging';

describe('ListPanel', () => {
  const renderComponent = (
    newAggsState,
    newQueryState,
    newResultsState,
    newViewState
  ) => {
    merge(newAggsState, defaultAggs);
    merge(newQueryState, defaultQuery);
    merge(newResultsState, defaultResults);
    merge(newViewState, defaultView);
    const data = {
      aggs: newAggsState,
      query: newQueryState,
      results: newResultsState,
      view: newViewState,
    };

    render(
      <IntlProvider locale="en">
        <ListPanel />
      </IntlProvider>,
      {
        preloadedState: data,
      }
    );
  };

  const analyticsSpy = jest
    .spyOn(utils, 'sendAnalyticsEvent')
    .mockImplementation(() => jest.fn());
  const itemFixture = {
    product:
      'Credit reporting, credit repair services, or other personal consumer reports',
    complaint_what_happened: '',
    date_sent_to_company: '2022-11-16T12:00:00-05:00',
    issue: 'Incorrect information on your report',
    sub_product: 'Credit reporting',
    zip_code: '12345',
    tags: null,
    has_narrative: false,
    complaint_id: '7990095',
    timely: 'Yes',
    consumer_consent_provided: null,
    company_response: 'In progress',
    submitted_via: 'Web',
    company: 'JP Morgan',
    date_received: '2022-11-16T12:00:00-05:00',
    state: 'FL',
    consumer_disputed: 'N/A',
    company_public_response: null,
    sub_issue: 'Public record information inaccurate',
  };

  test('Render ListPanel with no results', () => {
    const newAggsState = {
      error: '',
    };
    const newResultsState = {
      isLoading: false,
      items: [],
    };

    renderComponent(newAggsState, defaultQuery, newResultsState, defaultView);

    expect(
      screen.getByRole('heading', {
        name: /No results were found for your search/,
      })
    ).toBeDefined();
  });

  test('Render ListPanel with an error', () => {
    const newAggsState = {
      error: { message: 'error message', name: 'messageTypeName' },
    };

    renderComponent(newAggsState, defaultQuery, defaultResults, defaultView);

    expect(
      screen.getByText(/There was a problem executing your search/)
    ).toBeDefined();
  });

  test('Render ListPanel with an item', () => {
    const newAggsState = {
      error: '',
    };
    const newResultsState = { items: [itemFixture] };

    renderComponent(newAggsState, defaultQuery, newResultsState, defaultView);

    expect(screen.getByText('JP Morgan')).toBeDefined();
    expect(screen.getByText('11/16/2022')).toBeDefined();
  });

  test('onSize triggers dispatch and analtyics event', () => {
    const changeSizeSpy = jest
      .spyOn(pagingActions, 'changeSize')
      .mockImplementation(() => jest.fn());
    const newAggsState = {
      error: '',
    };
    const newQueryState = {
      size: 25,
      sort: 'created_date_desc',
    };
    const newResultsState = { items: [itemFixture] };

    renderComponent(newAggsState, newQueryState, newResultsState, defaultView);
    fireEvent.change(
      screen.getByRole('combobox', {
        name: 'Select the number of results to display at a time',
      }),
      { target: { value: '10' } }
    );

    expect(analyticsSpy).toBeCalledWith('Dropdown', '10 results');
    expect(changeSizeSpy).toBeCalledWith(10);
  });

  test('onSort triggers dispatch and analtyics event', () => {
    const changeSortSpy = jest
      .spyOn(pagingActions, 'changeSort')
      .mockImplementation(() => jest.fn());
    const newAggsState = {
      error: '',
    };
    const newQueryState = {
      size: 25,
      sort: 'created_date_desc',
    };
    const newResultsState = { items: [itemFixture] };

    renderComponent(newAggsState, newQueryState, newResultsState, defaultView);
    fireEvent.change(
      screen.getByRole('combobox', {
        name: 'Choose the order in which the results are displayed',
      }),
      { target: { value: 'created_date_asc' } }
    );

    expect(analyticsSpy).toBeCalledWith('Dropdown', 'Oldest to newest');
    expect(changeSortSpy).toBeCalledWith('created_date_asc');
  });

  test('FilterPanel showed when width is 500', () => {
    const newViewState = { width: 500 };

    renderComponent(defaultAggs, defaultQuery, defaultResults, newViewState);

    expect(screen.getByText('Filter results by...')).toBeDefined();
  });

  test('FilterPanel not showed when width is 1000', () => {
    const newViewState = { width: 1000 };

    renderComponent(defaultAggs, defaultQuery, defaultResults, newViewState);

    expect(screen.queryByText('Filter results by...')).toBeNull();
  });
});
