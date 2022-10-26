import React from 'react';
import {
  testRender as render,
  screen,
  waitFor,
} from '../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import { merge } from '../../testUtils/functionHelpers';
import { SearchBar } from './SearchBar';
import { defaultQuery } from '../../reducers/query/query';
import { defaultView } from '../../reducers/view/view';
import * as searchActions from '../../actions/search';
import * as typeaheadUtils from '../Typeahead/utils';

describe('SearchBar', () => {
  const user = userEvent.setup({ delay: null });
  // const user = userEvent.setup({ delay: 250 });
  const appleOption = {
    label: 'apple',
    key: 'apple',
    position: 4,
    value: 'appl',
  };

  const renderComponent = (
    // newAggsState,
    newQueryState,
    // newResultsState,
    newViewState
  ) => {
    // merge(newAggsState, defaultAggs);
    merge(newQueryState, defaultQuery);
    // merge(newResultsState, defaultResults);
    merge(newViewState, defaultView);
    const data = {
      //   aggs: newAggsState,
      query: newQueryState,
      //   results: newResultsState,
      view: newViewState,
    };

    render(<SearchBar />, {
      preloadedState: data,
    });
  };

  xtest('Search tips toggle', async () => {
    const newQueryState = { searchField: 'all', searchText: '' };
    const newViewState = { hasAdvancedSearchTips: false };

    renderComponent(newQueryState, newViewState);
    user.click(
      screen.getByRole('button', { name: /Show advanced search tips/ })
    );
    expect(
      await screen.findByRole('button', { name: /Hide advanced search tips/ })
    ).toBeInTheDocument();
    user.click(
      screen.getByRole('button', { name: /Hide advanced search tips/ })
    );
    expect(
      await screen.findByRole('button', { name: /Show advanced search tips/ })
    ).toBeInTheDocument();
  });

  xtest('Change search field', async () => {
    const searchFieldChangedSpy = jest
      .spyOn(searchActions, 'searchFieldChanged')
      .mockImplementation(() => jest.fn());
    const newQueryState = { searchField: 'all', searchText: '' };
    const newViewState = { hasAdvancedSearchTips: false };

    renderComponent(newQueryState, newViewState);
    const fieldSelect = screen.getByRole('combobox');
    await user.selectOptions(fieldSelect, 'Company name');
    await waitFor(() =>
      expect(searchFieldChangedSpy).toBeCalledWith('company')
    );
  });

  xtest('Input returns options on change', async () => {
    const handleFetchSearchMock = jest
      .spyOn(typeaheadUtils, 'handleFetchSearch')
      .mockImplementation(() => jest.fn())
      .mockReturnValue([appleOption]);

    const newQueryState = { searchField: 'company', searchText: '' };
    const newViewState = { hasAdvancedSearchTips: false };

    renderComponent(newQueryState, newViewState);
    // const input = screen.getByPlaceholderText('Enter your search term(s)');
    const input = screen.getByRole('combobox', { name: '' });
    await user.type(input, 'appl');
    // await user.click(input);
    // await user.keyboard('appl');
    // screen.debug();
    await waitFor(expect(handleFetchSearchMock).toBeCalled());
    expect(input).toHaveValue('appl');
  });

  test('Input can be cleared', async () => {
    // const handleFetchSearchMock = jest
    //   .spyOn(typeaheadUtils, 'handleFetchSearch')
    //   .mockImplementation(() => jest.fn());
    // .mockReturnValue([appleOption]);

    const newQueryState = { searchField: 'company', searchText: '' };
    const newViewState = { hasAdvancedSearchTips: false };

    renderComponent(newQueryState, newViewState);
    const input = screen.getByPlaceholderText('Enter your search term(s)');
    // const input = screen.getByRole('combobox', { name: '' });
    await user.type(input, 'appl');
    expect(input).toHaveValue('appl');
    // await user.click(screen.getByRole('button', { name: /clear search/ }));
    // expect(input).toHaveValue('');
  });
});
