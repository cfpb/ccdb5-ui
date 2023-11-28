import React from 'react';
import {
  testRender as render,
  screen,
  waitFor,
} from '../../testUtils/test-utils';
import userEvent from '@testing-library/user-event';
import fetchMock from 'jest-fetch-mock';
import * as filterActions from '../../reducers/query/query';
import { CompanyTypeahead } from './CompanyTypeahead';

fetchMock.enableMocks();

describe('CompanyTypeahead', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  const user = userEvent.setup({ delay: null });

  test('Options appear when user types and dispatches addMultipleFilters on selection', async () => {
    fetch.mockResponseOnce(
      JSON.stringify(['Truist', 'Bank of America', 'Capital One'])
    );
    const addMultipleFiltersSpy = jest
      .spyOn(filterActions, 'addMultipleFilters')
      .mockImplementation(() => jest.fn());

    render(<CompanyTypeahead />);
    const input = screen.getByPlaceholderText('Enter company name');
    await user.type(input, 'Tr');
    const option = await screen.findByRole('option', {
      name: /Truist/,
    });
    await user.click(option);

    await waitFor(() =>
      expect(addMultipleFiltersSpy).toBeCalledWith('company', ['Truist'])
    );
  });
});
