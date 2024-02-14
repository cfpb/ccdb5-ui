import React from 'react';
import {
  testRender as render,
  screen,
  waitFor,
} from '../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import { merge } from '../../testUtils/functionHelpers';
import { defaultAggs } from '../../reducers/aggs/aggs';
import { defaultQuery } from '../../reducers/query/query';
import { Issue } from './Issue';
import { listOfIssues } from '../../testUtils/aggsConstants';
import * as filterActions from '../../actions/filter';

describe('Issue', () => {
  const user = userEvent.setup({ delay: null });
  const renderComponent = () => {
    const newAggsState = { issue: listOfIssues };
    const newQueryState = { issue: ['Incorrect information on your report'] };
    merge(newAggsState, defaultAggs);
    merge(newQueryState, defaultQuery);
    const data = {
      aggs: newAggsState,
      query: newQueryState,
    };

    render(<Issue />, {
      preloadedState: data,
    });
  };

  test('Options appear when user types and dispatches replaceFilters on selection', async () => {
    const replaceFiltersSpy = jest
      .spyOn(filterActions, 'replaceFilters')
      .mockImplementation(() => jest.fn());

    renderComponent();
    const input = screen.getByPlaceholderText('Enter name of issue');
    await user.type(input, 'Improper');
    const option = await screen.findByRole('option', {
      name: /Improper use of your report/,
    });
    await user.click(option);

    await waitFor(() =>
      expect(replaceFiltersSpy).toBeCalledWith('issue', [
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
