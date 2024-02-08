import React from 'react';
import {
  testRender as render,
  screen,
  waitFor,
} from '../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import { FederalState } from './FederalState';
import * as filterActions from '../../actions/filter';

describe('FederalState', () => {
  const user = userEvent.setup({ delay: null });

  test('Options appear when user types and dispatches addMultipleFilters on selection', async () => {
    const addMultipleFiltersSpy = jest
      .spyOn(filterActions, 'addMultipleFilters')
      .mockImplementation(() => jest.fn());

    render(<FederalState />);
    const input = screen.getByPlaceholderText(
      'Enter state name or abbreviation',
    );
    await user.type(input, 'Ma');
    const option = await screen.findByRole('option', {
      name: /(MD)/,
    });
    await user.click(option);

    await waitFor(() =>
      expect(addMultipleFiltersSpy).toBeCalledWith('state', ['MD']),
    );
  });

  test('No matches found appears if user types non-existing option', async () => {
    render(<FederalState />);
    const input = screen.getByPlaceholderText(
      'Enter state name or abbreviation',
    );
    await user.type(input, 'Apples');

    expect(await screen.findByText('No matches found.')).toBeInTheDocument();
  });

  test('Option list disappears when user removes text', async () => {
    render(<FederalState />);
    const input = screen.getByPlaceholderText(
      'Enter state name or abbreviation',
    );
    await user.type(input, 'Ma');
    const option = await screen.findByRole('option', {
      name: /(MD)/,
    });
    await user.clear(input);

    expect(option).not.toBeInTheDocument();
  });
});
