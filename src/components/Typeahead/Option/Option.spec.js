import React from 'react';
import { render, screen } from '@testing-library/react';
import { Option } from './Option';

describe('Option', () => {
  test('Option is not selected by default', () => {
    render(<Option children={<p>Virginia</p>} onClick={jest.fn()} />);

    expect(screen.getByRole('listitem')).not.toHaveClass('selected');
  });

  test('Option is selected when isSelected is true', () => {
    render(
      <Option
        children={<p>Virginia</p>}
        onClick={jest.fn()}
        isSelected={true}
      />
    );

    expect(screen.getByRole('listitem')).toHaveClass('selected');
  });
});
