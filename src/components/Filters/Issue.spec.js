import {
  testRender as render,
  screen,
  waitFor,
} from '../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import { merge } from '../../testUtils/functionHelpers';
import { aggsState } from '../../reducers/aggs/aggsSlice';
import { Issue } from './Issue';
import { listOfIssues } from '../../testUtils/aggsConstants';
import * as filterActions from '../../reducers/filters/filtersSlice';
import { filtersState } from '../../reducers/filters/filtersSlice';

describe('Issue', () => {
  const user = userEvent.setup({ delay: null });
  const renderComponent = () => {
    const newAggsState = { issue: listOfIssues };
    const newFiltersState = { issue: ['Incorrect information on your report'] };
    merge(newAggsState, aggsState);
    merge(newFiltersState, filtersState);
    const data = {
      aggs: newAggsState,
      filters: newFiltersState,
    };

    render(<Issue />, {
      preloadedState: data,
    });
  };

  test('Options appear when user types and dispatches filtersReplaced on selection', async () => {
    const filtersReplacedSpy = jest
      .spyOn(filterActions, 'filtersReplaced')
      .mockImplementation(() => jest.fn());

    renderComponent();
    const input = screen.getByPlaceholderText('Enter name of issue');
    await user.type(input, 'Improper');
    const option = await screen.findByRole('option', {
      name: /Improper use of your report/,
    });
    await user.click(option);

    await waitFor(() =>
      expect(filtersReplacedSpy).toBeCalledWith('issue', [
        'Incorrect information on your report',
        listOfIssues[0].key,
      ]),
    );
  });

  test('No matches found appears if user types non-existing option', async () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Enter name of issue');
    await user.type(input, 'Apples');

    expect(await screen.findByText('No matches found.')).toBeInTheDocument();
  });

  test('Option list disappears when user removes text', async () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Enter name of issue');
    await user.type(input, 'Improper');
    const option = await screen.findByRole('option', {
      name: /Improper use of your report/,
    });
    await user.clear(input);

    expect(option).not.toBeInTheDocument();
  });
});
