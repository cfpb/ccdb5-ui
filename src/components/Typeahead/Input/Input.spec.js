import {
  testRender as render,
  screen,
  fireEvent,
} from '../../../testUtils/test-utils';
import { Input } from './Input';

describe('Input', () => {
  const handleChangeMock = jest.fn();
  const handleEnterMock = jest.fn();
  const renderComponent = (handleClearMock, isVisible) => {
    render(
      <Input
        ariaLabel="Enter the term you want to search for"
        htmlId="searchText"
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
    expect(handleChangeMock).toBeCalled();
    fireEvent.click(input);
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleEnterMock).toBeCalled();
  });

  test('When handleClear is given then clear button is present', () => {
    const handleClearMock = jest.fn();
    renderComponent(handleClearMock, true);
    fireEvent.click(screen.getByRole('button', { name: 'clear search' }));
    expect(handleClearMock).toBeCalled();
  });
});
