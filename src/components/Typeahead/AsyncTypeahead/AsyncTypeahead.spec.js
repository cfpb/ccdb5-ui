import {
  testRender as render,
  screen,
  waitFor,
} from '../../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import { AsyncTypeahead } from './AsyncTypeahead';

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
      />,
    );
  };

  test('Value changes when user types', async () => {
    renderComponent('value');
    const input = screen.getByPlaceholderText('Enter your search term(s)');
    await user.type(input, 'new value');

    await waitFor(() => expect(handleSearchMock).toBeCalledTimes(1));
  });

  test('User can select value', async () => {
    renderComponent('value');
    const input = screen.getByPlaceholderText('Enter your search term(s)');
    await user.clear(input);
    await user.type(input, 'appl');
    await user.click(screen.getByRole('option', { name: /appl/ }));

    await waitFor(() => expect(handleChangeMock).toBeCalledTimes(1));
    expect(handleChangeMock).toBeCalledWith([appleOption]);
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
