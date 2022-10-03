import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HighlightingTypeahead } from './HighlightingTypeahead';

describe('HighlightingTypeahead', () => {
  const user = userEvent.setup();
  const mockOnSelect = jest.fn();

  test('When Ba is searched then Bar and Baz are returned', async () => {
    render(
      <HighlightingTypeahead
        onOptionSelected={mockOnSelect}
        options={['Foo', 'Bar', 'Baz']}
      />
    );
    await user.type(
      screen.getByPlaceholderText('Enter your search text'),
      'Ba'
    );
    const options = await screen.findAllByRole('listitem');

    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('Bar');
    expect(options[1]).toHaveTextContent('Baz');
  });

  test('When Fo is searched then Foo is returned', async () => {
    render(
      <HighlightingTypeahead
        onOptionSelected={mockOnSelect}
        options={['Foo', 'Bar', 'Baz']}
      />
    );
    await user.type(
      screen.getByPlaceholderText('Enter your search text'),
      'Fo'
    );
    const options = await screen.findAllByRole('listitem');

    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Foo');
  });
});
