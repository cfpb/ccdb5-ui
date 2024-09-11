import {
  testRender as render,
  screen,
  fireEvent,
} from '../../../testUtils/test-utils';
import { ClearButton } from './ClearButton';

describe('ClearButton', () => {
  const mockedOnClear = jest.fn();

  test('When clear button is clicked then onClear is called', () => {
    render(<ClearButton onClear={mockedOnClear} />);
    fireEvent.click(screen.getByLabelText('clear search'));

    expect(mockedOnClear).toBeCalledTimes(1);
  });
});
