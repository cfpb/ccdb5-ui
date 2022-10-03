import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Selector } from './Selector';

describe('Selector', () => {
  const user = userEvent.setup();
  const options = [
    {
      key: 'VI',
      label: 'Virgin Islands (VI)',
      position: 0,
      value: 'vi',
    },
    {
      key: 'VA',
      label: 'Virginia (VA)',
      position: 0,
      value: 'vi',
    },
    {
      key: 'WV',
      label: 'West Virginia (WV)',
      position: 5,
      value: 'vi',
    },
  ];
  function testRenderOption(obj) {
    return {
      value: obj.key,
      component: <div>{obj.label}</div>,
    };
  }
  const mockSelect = jest.fn();

  test('Footer does not appear and clicking option fires onOptionSelected', async () => {
    render(
      <Selector
        options={options}
        onOptionSelected={mockSelect}
        renderOption={testRenderOption}
      />
    );
    expect(await screen.findAllByRole('listitem')).toHaveLength(3);
    await user.click(screen.getByText('Virginia (VA)'));

    expect(mockSelect).toBeCalledTimes(1);
    expect(mockSelect).toBeCalledWith(1);
  });

  test('Footer appears in list', async () => {
    const placeholder = 'Keep typing to see more';

    render(
      <Selector
        options={options}
        onOptionSelected={mockSelect}
        renderOption={testRenderOption}
        footer={placeholder}
      />
    );

    expect(await screen.findAllByRole('listitem')).toHaveLength(4);
    expect(screen.findByText(placeholder)).toBeDefined();
  });
});
