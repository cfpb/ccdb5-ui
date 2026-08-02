import {
  fireEvent,
  screen,
  testRender as render,
} from '../../../test-utils/test-utils';
import { Input } from './input';

describe('Input', () => {
  const handleChangeMock = jest.fn();
  const handleEnterMock = jest.fn();
  const renderComponent = (handleClearMock, isVisible) => {
    render(
      <Input
        ariaLabel="Enter the term you want to search for"
        htmlId="search-text"
        handleChange={handleChangeMock}
        placeholder="Enter your search term(s)"
        value=""
        handleClear={handleClearMock}
        handlePressEnter={handleEnterMock}
        isClearVisible={isVisible || false}
      />,
    );
  };

  test('Handle when change and enter are called', () => {
    renderComponent();
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'text' } });
    expect(handleChangeMock).toHaveBeenCalled();
    fireEvent.click(input);
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleEnterMock).toHaveBeenCalled();
  });

  test('When handleClear is given then clear button is present', () => {
    const handleClearMock = jest.fn();
    renderComponent(handleClearMock, true);
    fireEvent.click(screen.getByRole('button', { name: 'clear search' }));
    expect(handleClearMock).toHaveBeenCalled();
  });
});
