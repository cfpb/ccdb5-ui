import {
  testRender as render,
  screen,
  waitFor,
} from '../../../testUtils/test-utils';
import fetchMock from 'jest-fetch-mock';
import userEvent from '@testing-library/user-event';
import { merge } from '../../../testUtils/functionHelpers';
import { Issue } from './Issue';
import { listOfIssues } from '../../../testUtils/aggsConstants';
import * as filterActions from '../../../reducers/filters/filtersSlice';
import { filtersState } from '../../../reducers/filters/filtersSlice';
import { aggResponse } from './fixture';

describe('Issue', () => {
  const user = userEvent.setup({ delay: null });
  const renderComponent = () => {
    const newFiltersState = { issue: ['Incorrect information on your report'] };
    merge(newFiltersState, filtersState);
    const data = {
      filters: newFiltersState,
      routes: { queryString: '?foo=bar' },
    };

    render(<Issue />, {
      preloadedState: data,
    });
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('Options appear when user types and dispatches filtersReplaced on selection', async () => {
    const filtersReplacedSpy = jest
      .spyOn(filterActions, 'filtersReplaced')
      .mockImplementation(() => jest.fn());
    fetchMock.mockResponseOnce(JSON.stringify(aggResponse));
    renderComponent();
    await screen.findByRole('button', {
      name: /Incorrect information on your report/,
    });
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
    fetchMock.mockResponseOnce(JSON.stringify(aggResponse));
    renderComponent();
    await screen.findByRole('button', {
      name: /Incorrect information on your report/,
    });

    const input = screen.getByPlaceholderText('Enter name of issue');
    await user.type(input, 'Apples');

    expect(await screen.findByText('No matches found.')).toBeInTheDocument();
  });

  test('Option list disappears when user removes text', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(aggResponse));
    renderComponent();
    await screen.findByRole('button', {
      name: /Incorrect information on your report/,
    });

    const input = screen.getByPlaceholderText('Enter name of issue');
    await user.type(input, 'Improper');
    const option = await screen.findByRole('option', {
      name: /Improper use of your report/,
    });
    await user.clear(input);

    expect(option).not.toBeInTheDocument();
  });
});
