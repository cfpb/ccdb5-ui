import React from 'react';
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
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'text' } });
    expect(handleChangeMock).toBeCalled();
    fireEvent.click(input);
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleEnterMock).toBeCalled();
  });

  test('When handleClear is not given then clear button is not present', () => {
    renderComponent();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('When handleClear is  given then clear button is present', () => {
    const handleClearMock = jest.fn();
    renderComponent(handleClearMock, true);
    expect(screen.getByRole('button')).toBeDefined();
    fireEvent.click(screen.getByRole('button'));
    expect(handleClearMock).toBeCalled();
  });
});
