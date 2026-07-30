import {
  fireEvent,
  screen,
  testRender as render,
} from '../../../test-utils/test-utils';
import { ClearButton } from './clear-button';

describe('ClearButton', () => {
  const mockedOnClear = jest.fn();

  test('When clear button is clicked then onClear is called', () => {
    render(<ClearButton onClear={mockedOnClear} />);
    fireEvent.click(screen.getByLabelText('clear search'));

    expect(mockedOnClear).toHaveBeenCalledTimes(1);
  });
});
