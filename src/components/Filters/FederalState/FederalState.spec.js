import {
  testRender as render,
  screen,
  waitFor,
} from '../../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import { FederalState } from './FederalState';
import * as filterActions from '../../../reducers/filters/filtersSlice';

describe('FederalState', () => {
  const user = userEvent.setup({ delay: null });

  test('Options appear when user types and dispatches multipleFiltersAdded on selection', async () => {
    const multipleFiltersAddedSpy = jest
      .spyOn(filterActions, 'multipleFiltersAdded')
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
      expect(multipleFiltersAddedSpy).toBeCalledWith('state', ['MD']),
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
