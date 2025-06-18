import {
  screen,
  testRender as render,
  waitFor,
} from '../../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import { AsyncTypeahead } from './AsyncTypeahead';
import fetchMock from 'jest-fetch-mock';
import { queryState } from '../../../reducers/query/querySlice';
import { viewState } from '../../../reducers/view/viewSlice';

fetchMock.enableMocks();

describe('AsyncTypeahead', () => {
  const user = userEvent.setup({ delay: null });
  const appleOption = {
    label: 'apple',
    key: 'apple',
    position: 4,
    value: 'appl',
  };
  const handleChangeMock = jest.fn();
  const handleClearMock = jest.fn();
  const handleSearchMock = jest.fn();

  const renderComponent = (defaultValue, handleClear, isVisible) => {
    const data = {
      query: queryState,
      view: viewState,
    };

    render(
      <AsyncTypeahead
        ariaLabel="Enter the term you want to search for"
        htmlId="searchText"
        defaultValue={defaultValue}
        handleChange={handleChangeMock}
        handleClear={handleClear}
        handleSearch={handleSearchMock}
        hasClearButton={isVisible || false}
        options={[appleOption]}
        placeholder="Enter your search term(s)"
        fieldName="product"
      />,
      {
        preloadedState: data,
      },
    );
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('Value changes when user types', async () => {
    fetchMock.mockResponse(JSON.stringify(['Banco', 'Bank of America']));
    renderComponent('value');
    const input = screen.getByPlaceholderText('Enter your search term(s)');
    await user.clear(input);
    await user.type(input, 'ban');
    await screen.findByRole('option', {
      name: /Banco/,
    });
    expect(
      screen.getByRole('option', {
        name: /Banco/,
      }),
    ).toBeInTheDocument();
  });

  test('User can select value', async () => {
    fetchMock.mockResponse(JSON.stringify(['Apple', 'Apple Bank']));
    renderComponent('value');
    const input = screen.getByPlaceholderText('Enter your search term(s)');
    await user.clear(input);
    await user.type(input, 'apple');
    await screen.findAllByRole('option', { name: /Apple/ });
    await user.click(screen.getByRole('option', { name: /Apple Bank/ }));
    await waitFor(() => expect(handleChangeMock).toBeCalledTimes(7));
  });

  test('User can clear input value from default value', async () => {
    renderComponent('value', handleClearMock, true);
    const input = screen.getByPlaceholderText('Enter your search term(s)');
    expect(input).toHaveValue('value');
    await user.click(screen.getByRole('button', { name: /clear search/ }));

    await waitFor(() => expect(handleClearMock).toBeCalledTimes(1));
    expect(input).toHaveValue('');
  });

  test('User can clear input value from user inputed value', async () => {
    renderComponent('', handleClearMock, true);
    const input = screen.getByPlaceholderText('Enter your search term(s)');
    expect(input).toHaveValue('');
    await user.type(input, 'new value');
    expect(input).toHaveValue('new value');
    await user.click(
      await screen.findByRole('button', { name: /clear search/ }),
    );

    await waitFor(() => expect(handleClearMock).toBeCalledTimes(1));
    expect(input).toHaveValue('');
  });

  test('If handleClear is not given then text is still cleared', async () => {
    renderComponent('', null, true);
    const input = screen.getByPlaceholderText('Enter your search term(s)');
    expect(input).toHaveValue('');
    await user.type(input, 'new value');
    expect(input).toHaveValue('new value');
    await user.click(
      await screen.findByRole('button', { name: /clear search/ }),
    );

    await waitFor(() => expect(handleClearMock).not.toBeCalled());
    expect(input).toHaveValue('');
  });

  test('Clear button is not visible if user types and then clears results', async () => {
    renderComponent('', handleClearMock, true);
    const input = screen.getByPlaceholderText('Enter your search term(s)');
    expect(input).toHaveValue('');
    await user.type(input, 'new value');
    expect(input).toHaveValue('new value');
    const clearButton = await screen.findByRole('button', {
      name: /clear search/,
    });
    expect(clearButton).toBeInTheDocument();
    await user.clear(input);
    expect(input).toHaveValue('');
    expect(clearButton).not.toBeInTheDocument();
  });
});
