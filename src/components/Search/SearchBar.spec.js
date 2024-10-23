import {
  testRender as render,
  screen,
  waitFor,
} from '../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import fetchMock from 'jest-fetch-mock';
import { merge } from '../../testUtils/functionHelpers';
import { SearchBar } from './SearchBar';
import { queryState } from '../../reducers/query/querySlice';
import { viewState } from '../../reducers/view/viewSlice';
import * as searchActions from '../../reducers/query/querySlice';

fetchMock.enableMocks();

describe('SearchBar', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  const user = userEvent.setup({ delay: null });
  const renderComponent = (newQueryState, newViewState) => {
    merge(newQueryState, queryState);
    merge(newViewState, viewState);
    const data = {
      query: newQueryState,
      view: newViewState,
    };

    render(<SearchBar />, {
      preloadedState: data,
    });
  };

  test('Search tips toggle', async () => {
    const newQueryState = { searchField: 'all', searchText: '' };
    const newViewState = { hasAdvancedSearchTips: false };

    renderComponent(newQueryState, newViewState);
    user.click(
      screen.getByRole('button', { name: /Show advanced search tips/ }),
    );
    expect(
      await screen.findByRole('button', { name: /Hide advanced search tips/ }),
    ).toBeInTheDocument();
    user.click(
      screen.getByRole('button', { name: /Hide advanced search tips/ }),
    );
    expect(
      await screen.findByRole('button', { name: /Show advanced search tips/ }),
    ).toBeInTheDocument();
  });

  test('Change search field', async () => {
    const searchFieldChangedSpy = jest
      .spyOn(searchActions, 'searchFieldChanged')
      .mockImplementation(() => jest.fn());
    const newQueryState = { searchField: 'all', searchText: '' };
    const newViewState = { hasAdvancedSearchTips: false };

    renderComponent(newQueryState, newViewState);
    const fieldSelect = screen.getByRole('combobox');
    await user.selectOptions(fieldSelect, 'Company name');
    await waitFor(() =>
      expect(searchFieldChangedSpy).toBeCalledWith('company'),
    );
  });

  test('Input can be inputed with enter key', async () => {
    const searchTextChangedSpy = jest
      .spyOn(searchActions, 'searchTextChanged')
      .mockImplementation(() => jest.fn());
    const newQueryState = { searchField: '', searchText: '' };
    const newViewState = { hasAdvancedSearchTips: false };

    renderComponent(newQueryState, newViewState);
    const input = screen.getByPlaceholderText('Enter your search term(s)');
    await user.type(input, 'value');
    expect(input).toHaveValue('value');
    await user.click(input);
    await user.keyboard('{Shift}');
    expect(input).toHaveValue('value');
    await user.keyboard('{Enter}');
    await waitFor(() => expect(searchTextChangedSpy).toBeCalledWith('value'));
  });

  test('Input can be inputed and then cleared', async () => {
    const searchTextChangedSpy = jest
      .spyOn(searchActions, 'searchTextChanged')
      .mockImplementation(() => jest.fn());
    const newQueryState = { searchField: '', searchText: '' };
    const newViewState = { hasAdvancedSearchTips: false };

    renderComponent(newQueryState, newViewState);
    const input = screen.getByPlaceholderText('Enter your search term(s)');
    await user.type(input, 'value');
    expect(input).toHaveValue('value');
    await user.click(screen.getByRole('button', { name: /clear search/ }));
    await waitFor(() => expect(searchTextChangedSpy).toBeCalledWith(''));
    expect(input).toHaveValue('');
  });

  test('When company searchField is selected, options appear when user types and dispatches searchTextChanged on selection', async () => {
    fetch.mockResponseOnce(JSON.stringify(['Truist', 'Bank of America']));
    const searchTextChangedSpy = jest
      .spyOn(searchActions, 'searchTextChanged')
      .mockImplementation(() => jest.fn());
    const newQueryState = { searchField: 'company', searchText: '' };
    const newViewState = { hasAdvancedSearchTips: false };

    renderComponent(newQueryState, newViewState);
    const input = screen.getByPlaceholderText('Enter your search term(s)');
    await user.type(input, 'Tru');
    const option = await screen.findByRole('option', {
      name: /Truist/,
    });
    await user.click(option);

    await waitFor(() => expect(searchTextChangedSpy).toBeCalledWith('Truist'));
  });

  test('When company searchField is selected, input can be cleared', async () => {
    fetch.mockResponseOnce(JSON.stringify(['Truist', 'Bank of America']));
    const searchTextChangedSpy = jest
      .spyOn(searchActions, 'searchTextChanged')
      .mockImplementation(() => jest.fn());
    const newQueryState = { searchField: 'company', searchText: '' };
    const newViewState = { hasAdvancedSearchTips: false };

    renderComponent(newQueryState, newViewState);
    const input = screen.getByPlaceholderText('Enter your search term(s)');
    await user.type(input, 'appl');
    expect(input).toHaveValue('appl');
    user.click(await screen.findByRole('button', { name: /clear search/ }));
    await waitFor(() => expect(searchTextChangedSpy).toBeCalledWith(''));
  });
});
