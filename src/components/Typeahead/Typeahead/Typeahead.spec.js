import {
  testRender as render,
  screen,
  waitFor,
} from '../../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import { Typeahead } from './Typeahead';

describe('Typeahead', () => {
  const user = userEvent.setup({ delay: null });
  const appleOption = {
    label: 'apple',
    key: 'apple',
    position: 4,
    value: 'appl',
  };
  const handleChangeMock = jest.fn();
  const handleInputChangeMock = jest.fn();

  const renderComponent = (hasClear) => {
    render(
      <Typeahead
        ariaLabel="Start typing to begin options"
        htmlId="options-typeahead"
        handleChange={handleChangeMock}
        handleInputChange={handleInputChangeMock}
        hasClearButton={hasClear || false}
        options={[appleOption]}
        placeholder="Enter search terms"
      />,
    );
  };

  test('Value changes when user types', async () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Enter search terms');
    await user.type(input, 'new value');

    await waitFor(() => expect(handleInputChangeMock).toBeCalled());
    expect(input).toHaveValue('new value');
  });

  test('User can select value', async () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Enter search terms');
    await user.type(input, 'appl');
    await user.click(screen.getByRole('option', { name: /appl/ }));

    await waitFor(() => expect(handleChangeMock).toBeCalledTimes(1));
    expect(handleChangeMock).toBeCalledWith([appleOption]);
  });

  test('User can clear input value', async () => {
    renderComponent(true);
    const input = screen.getByPlaceholderText('Enter search terms');
    await user.type(input, 'appl');
    expect(input).toHaveValue('appl');
    await user.click(screen.getByRole('button', { name: /clear search/ }));

    await waitFor(() => expect(input).toHaveValue(''));
  });
});
